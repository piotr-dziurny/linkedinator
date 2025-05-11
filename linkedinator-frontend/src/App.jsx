import { useState, useRef } from "react"
import "./App.css"
import logo from "./assets/logo_linkedinator_no_bg.png";

function App() {
  const [topic, setTopic] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [language, setLanguage] = useState("English") // Default language
  const [errorMessage, setErrorMessage] = useState("")

const translations = {
  English: {
    subtitle: "Generate impactful Linkedin content tailored precisely to your professional level",
    roleTitle: "Select your professional seniority:",
    topicTitle: "What professional insights would you like to share?",
    topicPlaceholder: "Enter text to enhance or specify a topic (e.g., AI, Leadership, Project Management)",
    generateButton: "Generate post",
    generating: "Generating...",
    resultTitle: "Your Linkedin post",
    copyButton: "Copy to clipboard",
    copiedMessage: "Successfully copied!",
    errorMessage: "An error occurred. Please try again."
  },
  Polish: {
    subtitle: "Wygeneruj angażujący post na Linkedin idealnie dostosowany do Twojego poziomu zawodowego",
    roleTitle: "Wskaż swój poziom w strukturze organizacyjnej:",
    topicTitle: "Jakimi zawodowymi przemyśleniami chcesz się podzielić?",
    topicPlaceholder: "Wpisz tekst do ulepszenia lub temat (np. AI, przywództwo, zarządzanie projektami)",
    generateButton: "Wygeneruj post",
    generating: "Generowanie...",
    resultTitle: "Twój profesjonalny post na Linkedin",
    copyButton: "Kopiuj do schowka",
    copiedMessage: "Pomyślnie skopiowano!",
    errorMessage: "Wystąpił błąd. Spróbuj ponownie."
  }
};
  
  // Handle language change
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
  }
  
  // Current language translations
  const t = translations[language]

  // Handle role selection
  const handleRoleChange = (role) => {
    setSelectedRole(role)
  }
   
  // Handle content generation
  const handleGenerate = async () => {
    if (!topic.trim() || !selectedRole) return
    
    // Reset any previous errors
    setErrorMessage("")
    
    // Show loading state
    setIsGenerating(true)
    setGeneratedContent("")
    
    try {
      // Prepare the data for the API request
      const requestData = {
        role: selectedRole,
        language: language,
        prompt: topic
      }
      
      // Make the API call to the backend
      const backend_url = import.meta.env.VITE_BACKEND_URL
      const response = await fetch(`${backend_url}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      })
      
      // Check if response is successful
      if (!response.ok) {
        throw new Error(`HTTP error - Status: ${response.status}`)
      }
      
      // Parse the JSON response
      const data = await response.json()
      
      // Check if there's an error in the response
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Set the generated content
      setGeneratedContent(data.result)
    } catch (error) {
      console.error("Error generating content:", error)
      setErrorMessage(t.errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }
    
  return (
    <div className="app-container">
      {/* Language selector in top left corner */}
      <div className="language-selector">
        <select value={language} onChange={handleLanguageChange}>
          <option value="English">English</option>
          <option value="Polish">Polski</option>
        </select>
      </div>
      
      <div className="content-wrapper">
        <header className="app-header">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>
          <p className="app-subtitle">{t.subtitle}</p>
        </header>
        
        <div className="content-generator-container">
          {/* Role selector component */}
          <div className="form-section">
            <h2 className="section-title">{t.roleTitle}</h2>
            <div className="role-options">
              {["Junior", "Regular", "Senior", "VP"].map((role) => (
                <div 
                  key={role} 
                  className={`role-option ${selectedRole === role ? "selected" : ""}`}
                  onClick={() => handleRoleChange(role)}
                >
                  <input 
                    type="radio" 
                    id={role} 
                    name="role" 
                    checked={selectedRole === role} 
                    onChange={() => handleRoleChange(role)}
                  />
                  <label htmlFor={role}>{role}</label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Prompt input */}
          <div className="form-section">
            <h2 className="section-title">{t.topicTitle}</h2>
            <div className="topic-input-container">
              <input
                type="text"
                className="topic-input"
                placeholder={t.topicPlaceholder}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>
          
          {/* Generate button */}
          <div className="form-section">
            <button 
              className="generate-button"
              onClick={handleGenerate}
              disabled={!topic.trim() || !selectedRole || isGenerating}
            >
              {isGenerating ? t.generating : t.generateButton}
            </button>
            
            {/* Display error message if there is one */}
            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}
          </div>
          
          {/* Generated content display */}
          {generatedContent && (
            <div className="form-section result-section">
            <h2 className="section-title">{t.resultTitle}</h2>
              <div className="generated-content">
                <textarea 
                  readOnly 
                  value={generatedContent}
                  className="content-display"
                />
                <button 
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedContent);
                    alert(t.copiedMessage);
                  }}
                >
                  {t.copyButton}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
