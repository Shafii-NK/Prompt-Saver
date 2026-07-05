# **Prompt Saver - Developer Prompt Library** 📚

## **Overview**

Prompt Saver is a lightweight web application designed for developers and AI enthusiasts to save, organize, and manage their favorite AI prompts locally. Keep all your go-to prompts in one clean, accessible library without relying on external services or cloud storage. Your prompts are stored securely in your browser's local storage.

## **Features**

✨ **Save Prompts Effortlessly** - Add prompts with a title and content through an intuitive form interface  
📋 **Organized Library** - View all saved prompts in a clean card-based grid layout  
👁️ **Quick Previews** - See the first 10 words of each prompt for quick scanning  
🗑️ **One-Click Deletion** - Remove prompts instantly with a delete button  
💾 **Local Storage** - All prompts are stored locally in your browser (no server required)  
🎨 **Modern UI** - Dark theme with glassmorphism design elements and smooth interactions  
🔒 **Secure & Private** - Your data never leaves your device

## **How to Use**

1. **Open the Application** - Load `index.html` in your web browser
2. **Add a Prompt** - Fill in the "Prompt Title" and "Prompt Content" fields
3. **Save** - Click the "Save Prompt" button to store your prompt locally
4. **View Library** - Your saved prompts appear in the "Saved Prompts" section below
5. **Delete Prompts** - Click the "Delete" button on any prompt card to remove it

## **Technical Stack**

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no frameworks required)
- **Storage**: Browser localStorage API for persistent, client-side data storage
- **Design**: Custom CSS with dark theme, responsive layout, and glassmorphism effects
- **Browser Compatibility**: All modern browsers (Chrome, Firefox, Safari, Edge)

## **File Structure**

```
├── index.html    # Main HTML structure and form
├── script.js     # JavaScript logic for CRUD operations and state management
└── styles.css    # Modern dark theme styling
```

## **Installation & Setup**

No installation required! Simply:

1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start saving your prompts immediately

## **Features in Detail**

### Data Persistence

Prompts are automatically saved to your browser's localStorage with a unique ID timestamp, ensuring no data loss between sessions.

### XSS Protection

The application includes HTML escaping for all user inputs to prevent cross-site scripting attacks.

### Empty State Handling

When no prompts are saved, a friendly message guides users to add their first prompt.

## **Browser Requirements**

- Modern web browser with localStorage support
- JavaScript enabled
- CSS Grid and Flexbox support for optimal layout

## **Limitations**

- Data is stored locally in the browser, not synced across devices
- Clearing browser data or cache will remove saved prompts
- Storage limit depends on browser (typically 5-10MB)

## **Future Enhancements**

- Export/import prompts functionality
- Search and filter capabilities
- Categorize prompts by tags
- Cloud sync option
- Dark/Light theme toggle
- Copy to clipboard feature
