# TOTP App Interaction Design Document

## I. TOTP Configuration Page (Full Screen with Bottom Sheet Interaction)
- **Trigger Method**: Click the plus button in the bottom right corner of the home page / Click on a list item
- **Display Mode**: Full screen modal that slides up from the bottom
- **Layout Structure**:
  - Title Bar: "TOTP Configuration" (centered at top) with close button
  - Content Area (scrollable):
    - Configuration Name Input Field (placeholder: "e.g., Github John", max 60 characters, required)
    - Service Provider Input Field (placeholder: "e.g., Google", max 30 characters, optional)
    - Secret Key Input Field (required, no format restrictions)
    - Advanced Settings (initially hidden, shown when "More" button is clicked):
      - Algorithm Dropdown (Options: SHA-1/SHA-256/SHA-512, default SHA-1)
      - OTP Digits Input Field (numeric input, 6-12 digits, default 6)
      - Time Window Input Field (numeric input, positive integer, default 30 seconds)
  - Bottom Action Bar (fixed):
    - Left: "More" button (toggles advanced settings)
    - Right: Confirm Button (validates form and saves on click)
- **Interaction Behavior**:
  - Slides up from bottom on open
  - Can be dismissed by:
    - Swiping down
    - Tapping close button
    - Tapping outside the modal
- **Validation Rules**:
  - Configuration name is required and ≤ 60 characters
  - Secret key is required
  - Digits must be 6-12
  - Time window must be ≥ 1 second

## II. TOTP List Page (Home Page)
- **List Item Structure**:
  - Left: Configuration Name (primary text)
  - Right: Operation Button (play/stop icon) + OTP Result (displayed during runtime)
  - Bottom: Remaining Time Progress Bar (updates dynamically)
- **Interaction Behavior**:
  - Click list item: Opens configuration page (populated with current configuration)
  - Click operation button: Toggles running state (play→stop shows OTP, stop→play hides)
  - Bottom right plus button: Fixed position, click to open new configuration page

## III. Multi-language Support
- Supports Chinese/English switching (expandable in the future)
- Key text elements: Configuration page title, input field placeholders, button text, etc. all support bilingual mapping

## IV. Settings Page
- **Access Method**: Click the settings icon in the top right corner of the navigation bar
- **Feature Options**:
  - Theme Switching (System/Light/Dark)
  - Language Switching (Chinese/English)
- **Layout Structure**:
  - Theme Settings Section
    - Title: "Theme Settings"
    - Option Buttons: System/Light/Dark
  - Language Settings Section
    - Title: "Language Settings"
    - Option Buttons: Chinese/English
- **Interaction Behavior**:
  - Click option buttons for immediate effect
  - Settings are automatically saved
  - Theme changes are previewed in real-time
  - Language changes require app restart