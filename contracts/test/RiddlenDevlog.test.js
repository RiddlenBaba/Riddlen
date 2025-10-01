const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("RiddlenDevlog - Security & Functionality Tests", function () {
  let devlog;
  let owner, writer1, writer2, attacker;
  let WRITER_ROLE, PAUSER_ROLE, UPGRADER_ROLE;

  beforeEach(async function () {
    [owner, writer1, writer2, attacker] = await ethers.getSigners();

    const RiddlenDevlog = await ethers.getContractFactory("RiddlenDevlog");
    devlog = await upgrades.deployProxy(
      RiddlenDevlog,
      [owner.address],
      { initializer: "initialize", kind: "uups" }
    );
    await devlog.waitForDeployment();

    WRITER_ROLE = await devlog.WRITER_ROLE();
    PAUSER_ROLE = await devlog.PAUSER_ROLE();
    UPGRADER_ROLE = await devlog.UPGRADER_ROLE();
  });

  describe("🔒 Security: Initialization", function () {
    it("should set owner with all roles", async function () {
      expect(await devlog.hasRole(await devlog.DEFAULT_ADMIN_ROLE(), owner.address)).to.be.true;
      expect(await devlog.hasRole(WRITER_ROLE, owner.address)).to.be.true;
      expect(await devlog.hasRole(PAUSER_ROLE, owner.address)).to.be.true;
      expect(await devlog.hasRole(UPGRADER_ROLE, owner.address)).to.be.true;
    });

    it("should prevent re-initialization", async function () {
      await expect(
        devlog.initialize(attacker.address)
      ).to.be.revertedWithCustomError(devlog, "InvalidInitialization");
    });
  });

  describe("🔒 Security: Access Control", function () {
    it("should prevent non-writers from posting", async function () {
      await expect(
        devlog.connect(attacker).createPost(
          "Test Title",
          "Test content here",
          "general",
          []
        )
      ).to.be.reverted;
    });

    it("should allow admin to add writers", async function () {
      await devlog.addWriter(writer1.address);
      expect(await devlog.hasRole(WRITER_ROLE, writer1.address)).to.be.true;
    });

    it("should prevent non-admin from adding writers", async function () {
      await expect(
        devlog.connect(attacker).addWriter(attacker.address)
      ).to.be.reverted;
    });

    it("should emit WriterAdded event", async function () {
      const tx = await devlog.addWriter(writer1.address);
      const receipt = await tx.wait();
      const block = await ethers.provider.getBlock(receipt.blockNumber);

      await expect(tx)
        .to.emit(devlog, "WriterAdded")
        .withArgs(writer1.address, owner.address, block.timestamp);
    });

    it("should allow admin to remove writers", async function () {
      await devlog.addWriter(writer1.address);
      await devlog.removeWriter(writer1.address);
      expect(await devlog.hasRole(WRITER_ROLE, writer1.address)).to.be.false;
    });

    it("should prevent adding zero address as writer", async function () {
      await expect(
        devlog.addWriter(ethers.ZeroAddress)
      ).to.be.revertedWith("Zero address");
    });
  });

  describe("🔒 Security: Input Validation", function () {
    beforeEach(async function () {
      await devlog.addWriter(writer1.address);
    });

    it("should reject title too short", async function () {
      await expect(
        devlog.connect(writer1).createPost(
          "AB", // 2 chars < MIN_TITLE_LENGTH (3)
          "Valid content here",
          "general",
          []
        )
      ).to.be.revertedWithCustomError(devlog, "InvalidTitle");
    });

    it("should reject title too long", async function () {
      const longTitle = "A".repeat(201); // > MAX_TITLE_LENGTH (200)
      await expect(
        devlog.connect(writer1).createPost(
          longTitle,
          "Valid content here",
          "general",
          []
        )
      ).to.be.revertedWithCustomError(devlog, "InvalidTitle");
    });

    it("should reject content too short", async function () {
      await expect(
        devlog.connect(writer1).createPost(
          "Valid Title",
          "Short", // 5 chars < MIN_CONTENT_LENGTH (10)
          "general",
          []
        )
      ).to.be.revertedWithCustomError(devlog, "InvalidContent");
    });

    it("should reject content too long", async function () {
      const longContent = "A".repeat(10001); // > MAX_CONTENT_LENGTH (10000)
      await expect(
        devlog.connect(writer1).createPost(
          "Valid Title",
          longContent,
          "general",
          []
        )
      ).to.be.revertedWithCustomError(devlog, "InvalidContent");
    });

    it("should reject empty category", async function () {
      await expect(
        devlog.connect(writer1).createPost(
          "Valid Title",
          "Valid content here",
          "", // Empty category
          []
        )
      ).to.be.revertedWithCustomError(devlog, "InvalidCategory");
    });

    it("should reject category too long", async function () {
      const longCategory = "A".repeat(51); // > MAX_CATEGORY_LENGTH (50)
      await expect(
        devlog.connect(writer1).createPost(
          "Valid Title",
          "Valid content here",
          longCategory,
          []
        )
      ).to.be.revertedWithCustomError(devlog, "InvalidCategory");
    });

    it("should reject too many tags", async function () {
      const tooManyTags = Array(11).fill("tag"); // > MAX_TAGS_PER_POST (10)
      await expect(
        devlog.connect(writer1).createPost(
          "Valid Title",
          "Valid content here",
          "general",
          tooManyTags
        )
      ).to.be.revertedWithCustomError(devlog, "InvalidTags");
    });

    it("should reject empty tag", async function () {
      await expect(
        devlog.connect(writer1).createPost(
          "Valid Title",
          "Valid content here",
          "general",
          ["valid", "", "tags"] // Empty tag
        )
      ).to.be.revertedWithCustomError(devlog, "InvalidTags");
    });

    it("should reject tag too long", async function () {
      const longTag = "A".repeat(31); // > MAX_TAG_LENGTH (30)
      await expect(
        devlog.connect(writer1).createPost(
          "Valid Title",
          "Valid content here",
          "general",
          [longTag]
        )
      ).to.be.revertedWithCustomError(devlog, "InvalidTags");
    });
  });

  describe("🔒 Security: Circuit Breakers", function () {
    beforeEach(async function () {
      await devlog.addWriter(writer1.address);
    });

    it("should allow posts within daily limit", async function () {
      const maxPosts = await devlog.MAX_POSTS_PER_DAY_PER_AUTHOR();

      for (let i = 0; i < maxPosts; i++) {
        await expect(
          devlog.connect(writer1).createPost(
            `Post ${i}`,
            "Valid content here for testing",
            "general",
            [`tag${i}`]
          )
        ).to.emit(devlog, "PostCreated");
      }

      expect(await devlog.getTodayPostCount(writer1.address)).to.equal(maxPosts);
    });

    it("should reject posts exceeding daily limit", async function () {
      const maxPosts = await devlog.MAX_POSTS_PER_DAY_PER_AUTHOR();

      // Fill up to limit
      for (let i = 0; i < maxPosts; i++) {
        await devlog.connect(writer1).createPost(
          `Post ${i}`,
          "Valid content here",
          "general",
          []
        );
      }

      // Try one more (should fail)
      await expect(
        devlog.connect(writer1).createPost(
          "Exceeding post",
          "This should fail",
          "general",
          []
        )
      ).to.be.revertedWithCustomError(devlog, "DailyLimitExceeded");
    });

    it("should revert when daily limit exceeded", async function () {
      const maxPosts = await devlog.MAX_POSTS_PER_DAY_PER_AUTHOR();

      for (let i = 0; i < maxPosts; i++) {
        await devlog.connect(writer1).createPost(
          `Post ${i}`,
          "Valid content here for testing",
          "general",
          []
        );
      }

      // Should revert with DailyLimitExceeded custom error
      await expect(
        devlog.connect(writer1).createPost(
          "Exceeding",
          "This triggers circuit breaker",
          "general",
          []
        )
      ).to.be.revertedWithCustomError(devlog, "DailyLimitExceeded");
    });

    it("should reset daily limit after 24 hours", async function () {
      const maxPosts = await devlog.MAX_POSTS_PER_DAY_PER_AUTHOR();

      // Fill today's limit
      for (let i = 0; i < maxPosts; i++) {
        await devlog.connect(writer1).createPost(
          `Post ${i}`,
          "Valid content here for testing purposes",
          "general",
          []
        );
      }

      // Advance 24 hours
      await time.increase(24 * 60 * 60);

      // Should be able to post again
      await expect(
        devlog.connect(writer1).createPost(
          "New Day Post",
          "Should work now",
          "general",
          []
        )
      ).to.emit(devlog, "PostCreated");
    });

    it("should track limits per author independently", async function () {
      await devlog.addWriter(writer2.address);

      const maxPosts = await devlog.MAX_POSTS_PER_DAY_PER_AUTHOR();

      // Writer1 fills their limit
      for (let i = 0; i < maxPosts; i++) {
        await devlog.connect(writer1).createPost(
          `Post ${i}`,
          "Valid content here for testing purposes",
          "general",
          []
        );
      }

      // Writer2 should still be able to post
      await expect(
        devlog.connect(writer2).createPost(
          "Writer2 Post",
          "Should work",
          "general",
          []
        )
      ).to.emit(devlog, "PostCreated");
    });
  });

  describe("🔒 Security: Emergency Pause", function () {
    beforeEach(async function () {
      await devlog.addWriter(writer1.address);
    });

    it("should allow pauser to pause", async function () {
      await devlog.pause();
      expect(await devlog.paused()).to.be.true;
    });

    it("should prevent non-pauser from pausing", async function () {
      await expect(
        devlog.connect(attacker).pause()
      ).to.be.reverted;
    });

    it("should emit EmergencyAction on pause", async function () {
      await expect(devlog.pause())
        .to.emit(devlog, "EmergencyAction")
        .withArgs(owner.address, "PAUSE", "0x", await time.latest() + 1);
    });

    it("should prevent posting when paused", async function () {
      await devlog.pause();

      await expect(
        devlog.connect(writer1).createPost(
          "Test",
          "Should fail when paused",
          "general",
          []
        )
      ).to.be.revertedWithCustomError(devlog, "EnforcedPause");
    });

    it("should allow admin to unpause", async function () {
      await devlog.pause();
      await devlog.unpause();
      expect(await devlog.paused()).to.be.false;
    });

    it("should emit EmergencyAction on unpause", async function () {
      await devlog.pause();

      await expect(devlog.unpause())
        .to.emit(devlog, "EmergencyAction")
        .withArgs(owner.address, "UNPAUSE", "0x", await time.latest() + 1);
    });

    it("should allow posting after unpause", async function () {
      await devlog.pause();
      await devlog.unpause();

      await expect(
        devlog.connect(writer1).createPost(
          "Test",
          "Should work after unpause",
          "general",
          []
        )
      ).to.emit(devlog, "PostCreated");
    });
  });

  describe("✅ Functionality: Post Creation", function () {
    beforeEach(async function () {
      await devlog.addWriter(writer1.address);
    });

    it("should create post with valid inputs", async function () {
      await expect(
        devlog.connect(writer1).createPost(
          "First Post",
          "This is my first devlog entry!",
          "general",
          ["milestone", "v1.0"]
        )
      ).to.emit(devlog, "PostCreated");

      expect(await devlog.getTotalPosts()).to.equal(1);
    });

    it("should store post data correctly", async function () {
      await devlog.connect(writer1).createPost(
        "Test Post",
        "Test content",
        "technical",
        ["test", "audit"]
      );

      const post = await devlog.getPost(1);
      expect(post.id).to.equal(1);
      expect(post.author).to.equal(writer1.address);
      expect(post.title).to.equal("Test Post");
      expect(post.content).to.equal("Test content");
      expect(post.category).to.equal("technical");
      expect(post.tags).to.deep.equal(["test", "audit"]);
    });

    it("should support markdown content", async function () {
      const markdown = `## Heading

**Bold text** and *italic*

- List item 1
- List item 2

\`code block\``;

      await devlog.connect(writer1).createPost(
        "Markdown Test",
        markdown,
        "general",
        []
      );

      const post = await devlog.getPost(1);
      expect(post.content).to.equal(markdown);
    });

    it("should increment post IDs", async function () {
      await devlog.connect(writer1).createPost("Post 1", "Content for post number one", "general", []);
      await devlog.connect(writer1).createPost("Post 2", "Content for post number two", "general", []);
      await devlog.connect(writer1).createPost("Post 3", "Content for post number three", "general", []);

      expect(await devlog.getTotalPosts()).to.equal(3);
      const post3 = await devlog.getPost(3);
      expect(post3.id).to.equal(3);
    });
  });

  describe("✅ Functionality: View Functions", function () {
    beforeEach(async function () {
      await devlog.addWriter(writer1.address);

      // Create some posts
      await devlog.connect(writer1).createPost("Post 1", "Content for post one here", "oracle", ["v6.0"]);
      await devlog.connect(writer1).createPost("Post 2", "Content for post two here", "dao", ["governance"]);
      await devlog.connect(writer1).createPost("Post 3", "Content for post three here", "oracle", ["v6.0", "milestone"]);
    });

    it("should get recent posts in reverse chronological order", async function () {
      const posts = await devlog.getRecentPosts(0, 10);
      expect(posts.length).to.equal(3);
      expect(posts[0].title).to.equal("Post 3");
      expect(posts[1].title).to.equal("Post 2");
      expect(posts[2].title).to.equal("Post 1");
    });

    it("should paginate recent posts", async function () {
      const page1 = await devlog.getRecentPosts(0, 2);
      expect(page1.length).to.equal(2);
      expect(page1[0].title).to.equal("Post 3");

      const page2 = await devlog.getRecentPosts(2, 2);
      expect(page2.length).to.equal(1);
      expect(page2[0].title).to.equal("Post 1");
    });

    it("should filter posts by category", async function () {
      const oraclePosts = await devlog.getPostsByCategory("oracle");
      expect(oraclePosts.length).to.equal(2);
      expect(oraclePosts[0].title).to.equal("Post 1");
      expect(oraclePosts[1].title).to.equal("Post 3");
    });

    it("should filter posts by tag", async function () {
      const taggedPosts = await devlog.getPostsByTag("v6.0");
      expect(taggedPosts.length).to.equal(2);
    });

    it("should get posts by author", async function () {
      const authorPosts = await devlog.getPostsByAuthor(writer1.address);
      expect(authorPosts.length).to.equal(3);
    });

    it("should check if author is within limits", async function () {
      expect(await devlog.isWithinLimits(writer1.address)).to.be.true;
    });

    it("should return correct today post count", async function () {
      expect(await devlog.getTodayPostCount(writer1.address)).to.equal(3);
    });
  });

  describe("✅ Functionality: Version", function () {
    it("should return correct version", async function () {
      expect(await devlog.version()).to.equal("1.0.0-secure");
    });
  });
});
