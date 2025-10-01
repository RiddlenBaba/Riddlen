Gem::Specification.new do |spec|
  spec.name          = "riddlen-theme"
  spec.version       = "1.0.0"
  spec.authors       = ["Riddlen Protocol Team"]
  spec.email         = ["noreply@riddlen.org"]

  spec.summary       = "Official Riddlen Protocol documentation theme"
  spec.homepage      = "https://riddlen.org"
  spec.license       = "Apache-2.0"

  spec.files         = `git ls-files -z`.split("\x0").select do |f|
    f.match(%r{^(assets|_(includes|layouts|sass)/|(LICENSE|README)((\.(txt|md|markdown)|$)))}i)
  end

  spec.add_runtime_dependency "jekyll", "~> 4.0"
  spec.add_runtime_dependency "jekyll-seo-tag", "~> 2.0"
  spec.add_runtime_dependency "jekyll-sitemap", "~> 1.0"
end
