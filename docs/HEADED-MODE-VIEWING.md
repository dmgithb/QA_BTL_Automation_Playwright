# 🖥️ **Headed Mode Execution Viewing Guide**

## 🎯 **Overview: Viewing Tests in GitHub Actions**

While GitHub Actions runners are headless by default, there are several ways to view your Playwright tests running in "headed" mode or observe the execution visually.

---

## 🎥 **Option 1: Video Recordings (Recommended)** ⭐

### **Automatic Video Capture**
Your framework already captures videos on failures! But you can force video recording for all tests:

### **How to Enable:**
1. **Manual Trigger**: Go to Actions → "Playwright Tests with Video Recording" → Run workflow
2. **Choose test suite**: smoke, critical, or single-test
3. **Download videos**: From artifacts after execution

### **Video Features:**
```
✅ Full test execution recording
✅ Mouse movements and clicks
✅ Form interactions
✅ Page transitions
✅ Error moments captured
✅ High-quality WebM format
```

### **Access Videos:**
```bash
# After workflow completion:
1. Go to workflow run
2. Scroll to "Artifacts" section  
3. Download "test-videos-{suite-name}"
4. Extract and view .webm files
```

---

## 🎬 **Option 2: Screen Recording with Streaming** 

### **Live Execution Recording**
For complete visual debugging, use the streaming workflow:

### **How to Use:**
```bash
# Trigger the streaming workflow:
1. Actions → "Playwright Tests with Live Streaming"
2. Enable "stream_tests" checkbox
3. Run workflow
4. Download full execution recording
```

### **What You Get:**
```
🎥 Complete screen recording (MP4)
⏱️ Slow motion execution (--slowMo=1000)
🖱️ All mouse interactions visible
⌨️ Keyboard inputs shown
📱 Mobile device emulation (if used)
🔍 Error states clearly visible
```

---

## 🐛 **Option 3: Debug Mode (Detailed Analysis)**

### **Slow Motion Debugging**
Perfect for analyzing specific test failures:

### **Usage:**
```yaml
# Workflow: Debug Mode Tests
Inputs:
- test_file: "login.spec.ts" 
- slow_motion: "2000" # 2 second delays
```

### **Benefits:**
```
🕐 Configurable slow motion (500ms - 5000ms)
🎯 Single test focus
📸 Screenshot on every action
🎥 Video of entire execution
📋 Detailed console logs
```

---

## 🌐 **Option 4: VNC Remote Viewing (Advanced)**

### **Real-time Remote Desktop**
For live viewing during execution:

### **Setup Required:**
```bash
# This workflow sets up:
✅ Virtual display (Xvfb)
✅ VNC server
✅ Window manager (Fluxbox)
✅ Remote access capability
```

### **How It Works:**
```
1. Workflow creates virtual desktop
2. Runs tests in headed mode
3. VNC server provides remote access
4. You can connect during execution
```

---

## 📋 **Quick Reference: When to Use What**

### **🎥 Video Recording** - Most Common
```
✅ General test debugging
✅ Failure analysis
✅ Team demos
✅ Documentation
✅ Simple setup

Use when: You want to see what happened after test completion
```

### **🎬 Screen Recording** - Deep Analysis  
```
✅ Complex interaction debugging
✅ Performance analysis
✅ Full workflow understanding
✅ Training materials

Use when: You need complete execution visibility
```

### **🐛 Debug Mode** - Specific Issues
```
✅ Single test problems
✅ Timing issues
✅ Element interaction problems
✅ Slow execution analysis

Use when: Debugging specific test failures
```

### **🌐 VNC Viewing** - Live Monitoring
```
✅ Real-time execution watching
✅ Interactive debugging
✅ Live problem solving
✅ Advanced troubleshooting

Use when: You need live access during execution
```

---

## 🚀 **Quick Start Guide**

### **1. Immediate Video Recording**
```bash
# Fastest way to see test execution:
1. Go to GitHub Actions
2. Select "Playwright Tests with Video Recording"
3. Click "Run workflow"
4. Choose "single-test" 
5. Wait 2-3 minutes
6. Download artifacts
7. Open .webm video files
```

### **2. Debug Specific Test**
```bash
# For detailed analysis:
1. Actions → "Debug Mode Tests"
2. Enter test file: "user-management.spec.ts"
3. Set slow motion: "3000"
4. Run and download artifacts
```

### **3. Full Execution Recording**
```bash
# For complete workflow view:
1. Actions → "Playwright Tests with Live Streaming" 
2. Enable streaming
3. Download test-execution.mp4
```

---

## 📊 **Video Analysis Tips**

### **What to Look For:**
```
🎯 Element Selection: Is the right element clicked?
⏱️ Timing Issues: Are elements loaded before interaction?
📱 Responsive Behavior: How does the page adapt?
🔄 State Changes: Are transitions working correctly?
❌ Error States: What triggers failures?
```

### **Common Debugging Scenarios:**
```
🐛 Element Not Found:
   → Check if element is visible in video
   → Verify selector accuracy
   → Look for timing issues

🐛 Click Not Working:
   → See if element is clickable
   → Check for overlays/modals
   → Verify element state

🐛 Form Issues:
   → Watch field interactions
   → Check validation states
   → Verify submission process
```

---

## 🎬 **Advanced Video Features**

### **Custom Video Configuration**
Add to your test files:
```typescript
// Enable video for specific tests
test.use({ 
  video: 'on',
  screenshot: 'on' 
});

// Slow motion for debugging
test.use({ 
  launchOptions: { 
    slowMo: 2000 
  } 
});
```

### **Video Quality Settings**
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Video settings
    video: process.env.CI ? 'retain-on-failure' : 'on',
    
    // Screenshot settings  
    screenshot: process.env.CI ? 'only-on-failure' : 'on',
    
    // Slow motion for visibility
    launchOptions: {
      slowMo: process.env.DEBUG ? 1000 : 0
    }
  }
});
```

---

## 🔧 **Troubleshooting Video Issues**

### **Common Problems:**
```
❌ No videos generated:
   → Check video: 'on' in config
   → Verify workflow artifacts upload
   → Check test execution completion

❌ Videos too fast:
   → Add --slowMo parameter
   → Use debug mode workflow
   → Increase timeout values

❌ Poor video quality:
   → Videos are compressed for size
   → Use screen recording for quality
   → Download original artifacts
```

### **Video Optimization:**
```bash
# For better video analysis:
1. Use single worker (--workers=1)
2. Enable slow motion (--slowMo=1000)
3. Increase timeouts (--timeout=60000)
4. Force headed mode (--headed)
```

---

## 📱 **Mobile/Tablet Viewing**

### **Device Emulation Videos**
```typescript
// Record mobile test execution
test.use({ 
  ...devices['iPhone 13'],
  video: 'on' 
});

// Tablet testing with video
test.use({ 
  ...devices['iPad Pro'],
  video: 'on' 
});
```

---

## 🎯 **Best Practices**

### **Video Recording Guidelines:**
```
✅ Enable for debugging only (large files)
✅ Use retention-days to manage storage
✅ Focus on failing tests first
✅ Combine with screenshots for context
✅ Share videos for team collaboration
```

### **Performance Considerations:**
```
⚡ Videos slow down execution
⚡ Large artifact sizes
⚡ Use selectively for debugging
⚡ Clean up old artifacts regularly
```

---

## 🎉 **Summary**

**You now have multiple ways to view headed mode execution:**

1. **🎥 Video Recording** - See full test playback
2. **🎬 Screen Recording** - Complete execution capture  
3. **🐛 Debug Mode** - Slow motion analysis
4. **🌐 VNC Viewing** - Live remote access

**Most teams use video recording (Option 1) for 90% of debugging needs!**

---

*Start with video recording workflows - they're the easiest way to see exactly what your tests are doing in GitHub Actions!* 🚀
