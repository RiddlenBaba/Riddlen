# Claude Code Configuration - Test Directory

**Directory Purpose:** Test files and test utilities

## 🎯 What This Directory Is For

**Cross-project test files** that don't belong to a specific app (frontend has its own tests).

### What Lives Here
- ✅ Integration test files
- ✅ End-to-end test scenarios
- ✅ Test utilities and helpers
- ✅ Test fixtures and mocks
- ✅ Cross-contract test suites

### What Does NOT Live Here
- ❌ Smart contract tests (use `/contracts/test/`)
- ❌ Frontend unit tests (use `/frontend/__tests__/`)
- ❌ .env files or secrets
- ❌ Production code

---

## 📁 Stay In Your Lane

- Don't modify production code from here
- Don't change smart contracts from here
- Keep tests separate from implementation

---

## 🔒 Security Policy

### Test Data Only
- ✅ Use test wallets
- ✅ Use fake/mock data
- ❌ Never use real private keys
- ❌ Never test with production data

See `../.claudeignore` for restricted files.

---

## 🔄 Git Workflow

```bash
git add test/new-test.js
git commit -m "test: add integration test for riddle solving flow"
git push origin main
```

---

## ✅ Testing Standards

### Test Template
```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should do expected behavior', async () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Test Checklist
- [ ] Tests pass locally
- [ ] Tests are isolated (no dependencies)
- [ ] Tests use mock data
- [ ] Tests have clear descriptions
- [ ] Edge cases covered

---

## 🧹 Keep It Clean

### Organization
```
test/
├── integration/      # Cross-app integration tests
├── e2e/             # End-to-end tests
├── fixtures/        # Test data
├── helpers/         # Test utilities
└── archive/         # Old tests
```

---

## 📦 Archive Strategy

Archive tests for:
- Removed features
- Old contract versions
- Deprecated functionality

```bash
mv test/old-feature-test.js test/archive/
git commit -m "test: archive old feature tests"
```

---

## 🎯 Summary

✅ **DO:**
- Write comprehensive tests
- Use mock/test data only
- Keep tests isolated
- Run tests before committing
- Archive obsolete tests

❌ **DON'T:**
- Use production credentials
- Test against mainnet
- Commit failing tests
- Skip test documentation

---

**Related Files:**
- `../contracts/test/` - Smart contract tests
- `../.claudeignore` - Restricted files
