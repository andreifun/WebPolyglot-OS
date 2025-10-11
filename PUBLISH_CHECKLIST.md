# NPM Publish Checklist

## ✅ Completed

### Main Package (webpolyglot)
- [x] All tests passing (20/20)
- [x] Build successful (no errors)
- [x] TypeScript compilation clean
- [x] LICENSE file present (MIT)
- [x] README.md comprehensive and up-to-date
- [x] package.json properly configured
- [x] Author information correct
- [x] Repository URLs correct
- [x] Keywords added for discoverability
- [x] Type definitions included
- [x] Both CJS and ESM builds
- [x] Source maps generated
- [x] .npmignore configured
- [x] CHANGELOG.md created

### CLI Package (webpolyglot-cli)
- [x] Build successful
- [x] LICENSE file present
- [x] README.md created
- [x] package.json properly configured
- [x] Author information correct
- [x] Repository URLs correct
- [x] Bin entries configured
- [x] Keywords added

## 📋 Before Publishing

### Final Checks
1. **Test the packages locally**
   ```bash
   # Main package
   npm pack
   npm install ./webpolyglot-1.0.0.tgz
   
   # CLI package
   cd cli
   npm pack
   npm install -g ./webpolyglot-cli-1.0.0.tgz
   ```

2. **Test CLI commands**
   ```bash
   npx webpolyglot-init
   webpolyglot add es
   webpolyglot list
   ```

3. **Verify GitHub repository**
   - [ ] Repository exists at https://github.com/andreibalaban/webpolyglot
   - [ ] README is visible on GitHub
   - [ ] All code is pushed

4. **NPM account setup**
   - [ ] Logged into npm (`npm login`)
   - [ ] 2FA configured (recommended)
   - [ ] Package names available on npm

## 🚀 Publishing

### Main Package
```bash
npm publish
```

### CLI Package
```bash
cd cli
npm publish
```

## 📝 Post-Publish

1. **Verify packages on npm**
   - https://www.npmjs.com/package/webpolyglot
   - https://www.npmjs.com/package/webpolyglot-cli

2. **Test installation**
   ```bash
   npm install webpolyglot
   npx webpolyglot-init
   ```

3. **Create GitHub release**
   - Tag: v1.0.0
   - Include CHANGELOG content

4. **Update documentation**
   - Add badges to README (npm version, downloads, license)
   - Share on social media/communities

## 🔄 Future Updates

For version updates:
1. Update version in package.json (both packages)
2. Update CHANGELOG.md
3. Run tests and builds
4. Commit and push
5. Create git tag
6. Publish to npm
7. Create GitHub release
