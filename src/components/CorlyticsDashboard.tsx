import React, { useState, useEffect } from 'react'
import './CorlyticsDashboard.css'

interface ExpandedSections {
  [key: string]: boolean
}

interface DocumentItem {
  id: string
  title: string
  selected: boolean
  indented?: boolean
}


const CorlyticsDashboard: React.FC = () => {
  const [selectedRegulators, setSelectedRegulators] = useState<string[]>([
    'EU Parliament (EUPARL)', 
    'Austrian Regulator'
  ])
  
  const [mapName, setMapName] = useState<string>('Corlytics Global View')
  
  const [availableRegulators] = useState<string[]>([
    'EU Parliament (EUPARL)',
    'Austrian Regulator',
    'German Federal Financial Supervisory Authority (BaFin)',
    'UK Financial Conduct Authority (FCA)',
    'Swiss Financial Market Supervisory Authority (FINMA)',
    'French Prudential Supervision and Resolution Authority (ACPR)',
    'Italian Companies and Stock Exchange Commission (CONSOB)',
    'Spanish Securities Market Commission (CNMV)',
    'Dutch Authority for the Financial Markets (AFM)',
    'Belgian Financial Services and Markets Authority (FSMA)'
  ])
  
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    'European Union': true,
    'Austria': true
  })
  
    const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set())
  
  // Pagination for regulators
  const [currentPage, setCurrentPage] = useState<number>(1)
  const regulatorsPerPage = 3 // Breakpoint: show 3 regulators per page
  
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set())

  // Sync document selection state when selectedDocuments changes
  useEffect(() => {
    // This effect ensures the document selection state stays in sync
    // The actual selection state is managed by selectedDocuments Set
  }, [selectedDocuments])

  const toggleSection = (sectionName: string): void => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }))
  }

  const toggleHideSection = (sectionName: string): void => {
    setHiddenSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionName)) {
        newSet.delete(sectionName)
      } else {
        newSet.add(sectionName)
      }
      return newSet
    })
  }

  const toggleDocument = (documentId: string): void => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(documentId)) {
        newSet.delete(documentId)
      } else {
        newSet.add(documentId)
      }
      return newSet
    })
  }

  const selectAllDocuments = (documents: DocumentItem[]): void => {
    const selectableDocumentIds = documents
      .filter(doc => !doc.indented) // Only select non-indented documents
      .map(doc => doc.id)
    
    console.log('Selecting all documents:', selectableDocumentIds)
    
    setSelectedDocuments(prev => {
      const newSet = new Set(prev)
      // Add all selectable documents to the selection
      selectableDocumentIds.forEach(id => newSet.add(id))
      console.log('New selected documents:', Array.from(newSet))
      return newSet
    })
  }

  const deselectAllDocuments = (documents: DocumentItem[]): void => {
    const selectableDocumentIds = documents
      .filter(doc => !doc.indented) // Only deselect non-indented documents
      .map(doc => doc.id)
    
    console.log('Deselecting all documents:', selectableDocumentIds)
    
    setSelectedDocuments(prev => {
      const newSet = new Set(prev)
      // Remove all selectable documents from the selection
      selectableDocumentIds.forEach(id => newSet.delete(id))
      console.log('New selected documents:', Array.from(newSet))
      return newSet
    })
  }

  const handleSelectAllClick = (documents: DocumentItem[]): void => {
    const selectableDocuments = documents.filter(doc => !doc.indented)
    const selectedSelectableCount = selectableDocuments.filter(doc => selectedDocuments.has(doc.id)).length
    
    console.log('Select All clicked:', {
      selectableDocuments: selectableDocuments.length,
      selectedCount: selectedSelectableCount,
      documents: documents.map(d => ({ id: d.id, indented: d.indented }))
    })
    
    if (selectedSelectableCount === selectableDocuments.length) {
      // If all are selected, deselect all
      console.log('Deselecting all documents')
      deselectAllDocuments(documents)
    } else {
      // Otherwise, select all
      console.log('Selecting all documents')
      selectAllDocuments(documents)
    }
  }

  const handleMenuClick = (menuItem: string): void => {
    console.log(`Menu item clicked: ${menuItem}`)
    // Add navigation logic here
  }

  const handleButtonClick = (action: string): void => {
    console.log(`Button clicked: ${action}`)
    
    if (action === 'Save') {
      // Save all current state to localStorage
      const stateToSave = {
        selectedRegulators,
        selectedDocuments: Array.from(selectedDocuments),
        mapName,
        expandedSections,
        hiddenSections: Array.from(hiddenSections),
        currentPage,
        timestamp: new Date().toISOString()
      }
      
      localStorage.setItem('corlyticsDashboardState', JSON.stringify(stateToSave))
      console.log('State saved:', stateToSave)
      
      // Show success message
      alert('All changes have been saved successfully!')
    } else if (action === 'Cancel') {
      // Clear saved state and reset to defaults
      if (confirm('Are you sure you want to cancel? This will clear all saved data and reset to defaults.')) {
        localStorage.removeItem('corlyticsDashboardState')
        
        // Reset all state to defaults
        setSelectedRegulators(['EU Parliament (EUPARL)', 'Austrian Regulator'])
        setSelectedDocuments(new Set())
        setMapName('Corlytics Global View')
        setExpandedSections({
          'European Union': true,
          'Austria': true
        })
        setHiddenSections(new Set())
        setCurrentPage(1)
        
        alert('All data has been cleared and reset to defaults.')
      }
    }
  }

  const toggleRegulator = (regulator: string): void => {
    setSelectedRegulators(prev => {
      if (prev.includes(regulator)) {
        return prev.filter(r => r !== regulator)
      } else {
        return [...prev, regulator]
      }
    })
  }

  // Pagination functions
  const getPaginatedRegulators = (): string[] => {
    const startIndex = (currentPage - 1) * regulatorsPerPage
    const endIndex = startIndex + regulatorsPerPage
    return selectedRegulators.slice(startIndex, endIndex)
  }

  const totalPages = Math.ceil(selectedRegulators.length / regulatorsPerPage)

  const handlePageChange = (page: number): void => {
    setCurrentPage(page)
    // Scroll to top of sources section when changing pages
    const sourcesSection = document.querySelector('.sources-section')
    if (sourcesSection) {
      sourcesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-container')) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  // Reset to first page when regulators change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedRegulators])

  // Load saved state on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('corlyticsDashboardState')
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        
        // Restore all saved state
        if (parsedState.selectedRegulators) {
          setSelectedRegulators(parsedState.selectedRegulators)
        }
        if (parsedState.selectedDocuments) {
          setSelectedDocuments(new Set(parsedState.selectedDocuments))
        }
        if (parsedState.mapName) {
          setMapName(parsedState.mapName)
        }
        if (parsedState.expandedSections) {
          setExpandedSections(parsedState.expandedSections)
        }
        if (parsedState.hiddenSections) {
          setHiddenSections(new Set(parsedState.hiddenSections))
        }
        if (parsedState.currentPage) {
          setCurrentPage(parsedState.currentPage)
        }
        
        console.log('State restored:', parsedState)
      } catch (error) {
        console.error('Error loading saved state:', error)
      }
    }
  }, [])

  const europeanUnionDocuments: DocumentItem[] = [
    { id: 'acer-consult-c', title: 'ACER-CONSULT-C', selected: false, indented: false },
    { id: 'acts-freedom-security', title: 'Acts of freedom & Security and Justice', selected: false, indented: true },
    { id: 'gdpr-2016-679', title: 'European Commission Regulation on Data Protection and Privacy (GDPR) - 2016/679', selected: false, indented: false },
    { id: 'fra-report-2021', title: 'European Union Agency for Fundamental Rights (FRA) report on Freedom and Security - 2021', selected: false, indented: true },
    { id: 'regulation-eu-2016-679', title: 'Regulation (EU) 2016/679 on the protection of individuals with regard to the processing of personal data', selected: false, indented: false },
    { id: 'echr-case-law-2022', title: 'European Court of Human Rights case law on Security and Justice - 2022', selected: false, indented: true },
    { id: 'edpb-guidelines-2020', title: 'European Data Protection Board Guidelines on Consent - 2020', selected: false, indented: false },
    { id: 'eu-charter-article-6', title: 'EU Charter of Fundamental Rights - Article 6: Right to Liberty and Security', selected: false, indented: true }
  ]

  const austriaDocuments: DocumentItem[] = [
    { id: 'acer-consult-c-at', title: 'ACER-CONSULT-C', selected: false, indented: false },
    { id: 'acts-freedom-security-at', title: 'Acts of freedom & Security and Justice', selected: false, indented: true },
    { id: 'gdpr-2016-679-at', title: 'European Commission Regulation on Data Protection and Privacy (GDPR) - 2016/679', selected: false, indented: false },
    { id: 'fra-report-2021-at', title: 'European Union Agency for Fundamental Rights (FRA) report on Freedom and Security - 2021', selected: false, indented: true },
    { id: 'regulation-eu-2016-679-at', title: 'Regulation (EU) 2016/679 on the protection of individuals with regard to the processing of personal data', selected: false, indented: false },
    { id: 'echr-case-law-2022-at', title: 'European Court of Human Rights case law on Security and Justice - 2022', selected: false, indented: true }
  ]

  // Generate documents for other regulators
  const generateRegulatorDocuments = (regulatorName: string): DocumentItem[] => {
    const baseDocuments = [
      { title: 'Regulatory Framework Overview', indented: false },
      { title: 'Compliance Guidelines', indented: false },
      { title: 'Implementation Procedures', indented: true },
      { title: 'Monitoring & Reporting', indented: true },
      { title: 'Risk Assessment Framework', indented: false },
      { title: 'Audit Requirements', indented: true },
      { title: 'Enforcement Mechanisms', indented: false },
      { title: 'Stakeholder Engagement', indented: true }
    ]

    return baseDocuments.map((doc, index) => ({
      id: `${regulatorName.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
      title: doc.title,
      selected: false,
      indented: doc.indented
    }))
  }

  // Create a map of all available regulators with their documents
  const allRegulatorData = new Map<string, { name: string, documents: DocumentItem[] }>([
    ['EU Parliament (EUPARL)', { name: 'European Union', documents: europeanUnionDocuments }],
    ['Austrian Regulator', { name: 'Austria', documents: austriaDocuments }],
    ['German Federal Financial Supervisory Authority (BaFin)', { name: 'Germany', documents: generateRegulatorDocuments('German Federal Financial Supervisory Authority (BaFin)') }],
    ['UK Financial Conduct Authority (FCA)', { name: 'United Kingdom', documents: generateRegulatorDocuments('UK Financial Conduct Authority (FCA)') }],
    ['Swiss Financial Market Supervisory Authority (FINMA)', { name: 'Switzerland', documents: generateRegulatorDocuments('Swiss Financial Market Supervisory Authority (FINMA)') }],
    ['French Prudential Supervision and Resolution Authority (ACPR)', { name: 'France', documents: generateRegulatorDocuments('French Prudential Supervision and Resolution Authority (ACPR)') }],
    ['Italian Companies and Stock Exchange Commission (CONSOB)', { name: 'Italy', documents: generateRegulatorDocuments('Italian Companies and Stock Exchange Commission (CONSOB)') }],
    ['Spanish Securities Market Commission (CNMV)', { name: 'Spain', documents: generateRegulatorDocuments('Spanish Securities Market Commission (CNMV)') }],
    ['Dutch Authority for the Financial Markets (AFM)', { name: 'Netherlands', documents: generateRegulatorDocuments('Dutch Authority for the Financial Markets (AFM)') }],
    ['Belgian Financial Services and Markets Authority (FSMA)', { name: 'Belgium', documents: generateRegulatorDocuments('Belgian Financial Services and Markets Authority (FSMA)') }]
  ])

  // Initialize expanded sections for all available regulators
  useEffect(() => {
    const initialExpandedSections: ExpandedSections = {}
    availableRegulators.forEach(regulator => {
      const data = allRegulatorData.get(regulator)
      if (data) {
        initialExpandedSections[data.name] = true
      }
    })
    setExpandedSections(initialExpandedSections)
  }, [])

  const getSelectedCount = (documents: DocumentItem[]): number => {
    return documents.filter(doc => !doc.indented && selectedDocuments.has(doc.id)).length
  }

  const getTotalCount = (documents: DocumentItem[]): number => {
    return documents.filter(doc => !doc.indented).length
  }

  const renderDocumentItem = (document: DocumentItem) => {
    const isSelected = selectedDocuments.has(document.id)
    
    return (
      <div key={document.id} className={`document-item ${isSelected ? 'selected' : ''}`}>
        {!document.indented && (
          <div 
            className={`checkbox ${isSelected ? 'checked' : ''}`}
            onClick={() => toggleDocument(document.id)}
          >
            {isSelected ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect width="16" height="16" rx="2" fill="#1890ff"/>
                <path d="M6 8l2 2 4-4" stroke="white" strokeWidth="2"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect width="16" height="16" rx="2" stroke="#7c858c" strokeWidth="1"/>
              </svg>
            )}
          </div>
        )}
        
        {document.indented ? (
          <div className="indent"></div>
        ) : (
          <div className="document-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2h12v12H2z" stroke="#7c858c" strokeWidth="1"/>
              <path d="M6 6h4M6 8h4M6 10h2" stroke="#7c858c" strokeWidth="1"/>
            </svg>
          </div>
        )}
        
        <div className="document-title">{document.title}</div>
      </div>
    )
  }

  const renderRegionSection = (regionName: string, regulator: string, documents: DocumentItem[], selectedCount: number, totalCount: number) => {
    return (
      <div key={regionName} className="region-section">
        <div className="region-header">
          <div className="region-title">
            <span>{regionName}</span>
            <div className="alert-badge">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="#fd4748"/>
                <path d="M10 6v4M10 14h.01" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>
        
        {expandedSections[regionName] && !hiddenSections.has(regionName) && (
          <div className="region-content">
            <div className="content-header">
              <div className="content-title">
                <span>{regulator}</span>
                <div className="alert-badge">
                  <svg width="20" height="20" viewBox="0 0 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="#fd4748"/>
                    <path d="M10 6v4M10 14h.01" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              <div className="content-stats">
                <span>{selectedCount}/{totalCount} selected</span>
              </div>
              <div className="content-actions">
                <button 
                  className="btn btn-small btn-primary"
                  onClick={() => {
                    console.log('Select All button clicked for:', regulator)
                    console.log('Documents:', documents)
                    console.log('Current selected documents:', Array.from(selectedDocuments))
                    handleSelectAllClick(documents)
                  }}
                  disabled={documents.filter(doc => !doc.indented).length === 0}
                >
                  {(() => {
                    const selectableDocuments = documents.filter(doc => !doc.indented)
                    const selectedSelectableCount = selectableDocuments.filter(doc => selectedDocuments.has(doc.id)).length
                    return selectedSelectableCount === selectableDocuments.length ? 'Unselect All' : 'Select All'
                  })()}
                </button>
                <button 
                  className="btn btn-small btn-danger"
                  onClick={() => toggleHideSection(regionName)}
                >
                  {hiddenSections.has(regionName) ? 'Show' : 'Hide'}
                </button>
              </div>
            </div>

            <div className="document-list">
              {documents.map(renderDocumentItem)}
            </div>
          </div>
        )}
        
        {/* Hidden state - show only regulator name */}
        {hiddenSections.has(regionName) && (
          <div className="region-content-hidden">
            <div className="content-header-hidden">
              <div className="content-title-hidden">
                <div className="region-name-hidden">{regulator}</div>
                <div className="region-document-count-hidden">
                  {selectedCount} of {totalCount} documents selected
                </div>
                <div className="alert-badge">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="#fd4748"/>
                    <path d="M10 6v4M10 14h.01" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              <div className="content-actions-hidden">
                <button 
                  className="btn btn-small btn-danger"
                  onClick={() => toggleHideSection(regionName)}
                >
                  Show
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Left Navigation */}
      <div className="nav-sidebar">
        <div className="nav-header">
          <div className="user-info">
            <p className="user-name">Camelia Popa</p>
          </div>
        </div>
        
        <div className="nav-menu">
          <div className="menu-section">
            <div className="section-header">
              <p className="section-title">Content</p>
            </div>
            <div className="menu-items">
              {['Regulators', 'Obligation Terms', 'Regulators Export', 'Documents', 'BOT Health'].map(item => (
                <div 
                  key={item} 
                  className="menu-item"
                  onClick={() => handleMenuClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="menu-section">
            <div className="section-header">
              <p className="section-title">Regulations</p>
            </div>
            <div className="menu-items">
              {['Content Providers', 'Regulation Content Editor', 'Regulation Access Group'].map(item => (
                <div 
                  key={item} 
                  className="menu-item"
                  onClick={() => handleMenuClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="menu-section">
            <div className="section-header">
              <p className="section-title">Regulation Library</p>
            </div>
            <div className="menu-items">
              {['Bulk add regulations', 'Metadata'].map(item => (
                <div 
                  key={item} 
                  className="menu-item"
                  onClick={() => handleMenuClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="menu-section">
            <div className="section-header">
              <p className="section-title">Internal Controls</p>
            </div>
            <div className="menu-items">
              {['Standard Fields', 'Custom Fields'].map(item => (
                <div 
                  key={item} 
                  className="menu-item"
                  onClick={() => handleMenuClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="menu-section">
            <div className="section-header">
              <p className="section-title">Content Automation</p>
            </div>
            <div className="menu-items">
              {['Classification Models', 'Models Dashboard'].map(item => (
                <div 
                  key={item} 
                  className="menu-item"
                  onClick={() => handleMenuClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="menu-section">
            <div className="section-header">
              <p className="section-title">Taxonomy</p>
            </div>
            <div className="menu-items">
              {['Taxonomy Manager', 'Client Taxonomies', 'Edit Themes', 'All Dashboards'].map(item => (
                <div 
                  key={item} 
                  className={`menu-item ${item === 'Taxonomy Manager' ? 'active' : ''}`}
                  onClick={() => handleMenuClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="menu-section">
            <div className="section-header">
              <p className="section-title">Clients</p>
            </div>
            <div className="menu-items">
              {['Tagging Report', 'Client Usage', 'Client Usage by Feature', 'Corlytics Updates'].map(item => (
                <div 
                  key={item} 
                  className="menu-item"
                  onClick={() => handleMenuClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="menu-section">
            <div className="section-header">
              <p className="section-title">Client Management</p>
            </div>
            <div className="menu-items">
              {['Workflow Routing', 'Workflow Config', 'Task Automation', 'Task Custom Fields', 'User Groups', 'Legal Entities', 'Procedures Config'].map(item => (
                <div 
                  key={item} 
                  className="menu-item"
                  onClick={() => handleMenuClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="menu-section">
            <div className="section-header">
              <p className="section-title">Push Api</p>
            </div>
            <div className="menu-items">
              <div 
                className="menu-item"
                onClick={() => handleMenuClick('Push Api Dashboard')}
              >
                Push Api Dashboard
              </div>
            </div>
          </div>

          <div className="menu-section">
            <div className="section-header">
              <p className="section-title">Reporting System</p>
            </div>
            <div className="menu-items">
              {['Report Logs', 'Report Statistics'].map(item => (
                <div 
                  key={item} 
                  className="menu-item"
                  onClick={() => handleMenuClick(item)}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">Corlytics</div>
              <div className="divider"></div>
              <div className="page-title">Content Workbench</div>
            </div>
            <div className="header-actions">
              <div className="settings-icon">
                <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.5172 19.2322C17.5172 19.2322 17.7404 19.0089 18.1868 18.5625C18.6332 18.1161 18.8564 17.2619 18.8564 16C18.8564 14.7381 18.41 13.6607 17.5172 12.7679C16.6243 11.875 15.5469 11.4286 14.285 11.4286C13.0231 11.4286 11.9457 11.875 11.0529 12.7679C10.16 13.6607 9.71358 14.7381 9.71358 16C9.71358 17.2619 10.16 18.3393 11.0529 19.2322C11.9457 20.125 13.0231 20.5714 14.285 20.5714C15.5469 20.5714 16.6243 20.125 17.5172 19.2322ZM27.9993 14.0536V18.0179C27.9993 18.1607 27.9517 18.2976 27.8564 18.4286C27.7612 18.5595 27.6422 18.6369 27.4993 18.6607L24.1957 19.1607C23.9695 19.8036 23.7374 20.3452 23.4993 20.7857C23.916 21.381 24.5529 22.2024 25.41 23.25C25.5291 23.3929 25.5886 23.5417 25.5886 23.6964C25.5886 23.8512 25.535 23.9881 25.4279 24.1072C25.1064 24.5476 24.5172 25.1905 23.66 26.0357C22.8029 26.881 22.2433 27.3036 21.9814 27.3036C21.8386 27.3036 21.6838 27.25 21.5172 27.1429L19.0529 25.2143C18.5291 25.4881 17.9874 25.7143 17.4279 25.8929C17.2374 27.5119 17.0648 28.6191 16.91 29.2143C16.8267 29.5476 16.6124 29.7143 16.2672 29.7143H12.3029C12.1362 29.7143 11.9904 29.6637 11.8654 29.5625C11.7404 29.4613 11.6719 29.3333 11.66 29.1786L11.16 25.8929C10.5767 25.7024 10.041 25.4822 9.55287 25.2322L7.03501 27.1429C6.91596 27.25 6.76715 27.3036 6.58858 27.3036C6.42192 27.3036 6.27311 27.2381 6.14215 27.1072C4.64215 25.75 3.66001 24.75 3.19572 24.1072C3.11239 23.9881 3.07072 23.8512 3.07072 23.6964C3.07072 23.5536 3.11834 23.4167 3.21358 23.2857C3.39215 23.0357 3.69572 22.6399 4.1243 22.0982C4.55287 21.5566 4.8743 21.1369 5.08858 20.8393C4.76715 20.2441 4.52311 19.6548 4.35644 19.0714L1.08858 18.5893C0.93382 18.5655 0.80882 18.4911 0.713582 18.3661C0.618344 18.2411 0.570724 18.1012 0.570724 17.9464V13.9822C0.570724 13.8393 0.618344 13.7024 0.713582 13.5714C0.80882 13.4405 0.921915 13.3631 1.05287 13.3393L4.3743 12.8393C4.54096 12.2917 4.77311 11.7441 5.07072 11.1964C4.59453 10.5179 3.95763 9.69644 3.16001 8.73215C3.04096 8.58929 2.98144 8.44644 2.98144 8.30358C2.98144 8.18453 3.03501 8.04763 3.14215 7.89286C3.45168 7.46429 4.03799 6.82441 4.90108 5.97322C5.76418 5.12203 6.32668 4.69644 6.58858 4.69644C6.74334 4.69644 6.89811 4.75596 7.05287 4.87501L9.51715 6.78572C10.041 6.51191 10.5826 6.28572 11.1422 6.10715C11.3326 4.4881 11.5052 3.38096 11.66 2.78572C11.7433 2.45239 11.9576 2.28572 12.3029 2.28572H16.2672C16.4338 2.28572 16.5797 2.33632 16.7047 2.43751C16.8297 2.5387 16.8981 2.66667 16.91 2.82144L17.41 6.10715C17.9933 6.29763 18.5291 6.51786 19.0172 6.76786L21.5529 4.85715C21.66 4.75001 21.8029 4.69644 21.9814 4.69644C22.1362 4.69644 22.285 4.75596 22.4279 4.87501C23.9636 6.29167 24.9457 7.30358 25.3743 7.91072C25.4576 8.00596 25.4993 8.13691 25.4993 8.30358C25.4993 8.44644 25.4517 8.58334 25.3564 8.71429C25.1779 8.96429 24.8743 9.36013 24.4457 9.90179C24.0172 10.4435 23.6957 10.8631 23.4814 11.1607C23.791 11.756 24.035 12.3393 24.2136 12.9107L27.4814 13.4107C27.6362 13.4345 27.7612 13.5089 27.8564 13.6339C27.9517 13.7589 27.9993 13.8988 27.9993 14.0536Z" fill="#2C5C65"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <div className="breadcrumb-item">
            <span className="breadcrumb-link">Home</span>
          </div>
          <div className="breadcrumb-separator">
            <svg width="4" height="12" viewBox="0 0 4 12" fill="none">
              <path d="M0 0l4 6-4 6" stroke="#2c5c65" strokeWidth="1"/>
            </svg>
          </div>
          <div className="breadcrumb-item">
            <span className="breadcrumb-link">Select Client</span>
          </div>
          <div className="breadcrumb-separator">
            <svg width="4" height="12" viewBox="0 0 4 12" fill="none">
              <path d="M0 0l4 6-4 6" stroke="#2c5c65" strokeWidth="1"/>
            </svg>
          </div>
          <div className="breadcrumb-item">
            <span className="breadcrumb-text">Taxonomy Manager - Map Details</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="content-area">
          <div className="content-header">
            <div className="page-navigation">
              {['Map Details', 'Documents Mapping', 'Reg Category Structure', 'Reg Category Mapping', 'Service Line Structure', 'Service Line Mapping', 'Users Assignment'].map((item, index) => (
                <React.Fragment key={item}>
                  <span className="nav-link">{item}</span>
                  {index < 6 && (
                    <svg width="5" height="13" viewBox="0 0 5 13" fill="none">
                      <path d="M0 0l5 6.5L0 13" stroke="#2c5c65" strokeWidth="1"/>
                    </svg>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="content-body">
            <div className="page-info">
              <div className="page-subtitle">
                <p>Taxonomy mapping (page 1 of 7)</p>
              </div>
              <div className="page-title">
                <h1>Corlytics Global View</h1>
              </div>
              <div className="page-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleButtonClick('Cancel')}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleButtonClick('Save')}
                >
                  Save
                </button>
              </div>
            </div>

            <div className="action-buttons">
              {['Upload', 'Export Selected', 'Export All'].map(action => (
                <button 
                  key={action}
                  className="btn btn-primary"
                  onClick={() => handleButtonClick(action)}
                >
                  {action}
                </button>
              ))}

            </div>

            <div className="form-section">
              <div className="form-group">
                <label>Map Name:</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  placeholder="Enter map name"
                />
              </div>

              <div className="form-group">
                <label>Select Regulators:</label>
                <div className="dropdown-container">
                  <div 
                    className="dropdown-header"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className="dropdown-text">
                      {selectedRegulators.length === 0 
                        ? 'Select regulators...' 
                        : `${selectedRegulators.length} regulator${selectedRegulators.length !== 1 ? 's' : ''} selected`
                      }
                    </span>
                    <svg 
                      className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      fill="none"
                    >
                      <path d="M3 4.5L6 7.5L9 4.5" stroke="#7c858c" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  {dropdownOpen && (
                    <div className="dropdown-list">
                      {/* Select All Option */}
                      <div 
                        className="dropdown-item select-all-item"
                        onClick={() => {
                          if (selectedRegulators.length === availableRegulators.length) {
                            // If all are selected, deselect all
                            setSelectedRegulators([])
                          } else {
                            // Otherwise, select all
                            setSelectedRegulators([...availableRegulators])
                          }
                        }}
                      >
                        <div className={`dropdown-checkbox ${selectedRegulators.length === availableRegulators.length ? 'checked' : ''}`}>
                          {selectedRegulators.length === availableRegulators.length ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <rect width="16" height="16" rx="2" fill="#1890ff"/>
                              <path d="M6 8l2 2 4-4" stroke="white" strokeWidth="2"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <rect width="16" height="16" rx="2" stroke="#7c858c" strokeWidth="1"/>
                            </svg>
                          )}
                        </div>
                        <span className="dropdown-item-text select-all-text">
                          {selectedRegulators.length === availableRegulators.length ? 'Unselect All' : 'Select All'}
                        </span>
                      </div>
                      
                      {/* Divider */}
                      <div className="dropdown-divider"></div>
                      
                      {/* Individual Regulators */}
                      {availableRegulators.map((regulator) => (
                        <div 
                          key={regulator}
                          className={`dropdown-item ${selectedRegulators.includes(regulator) ? 'selected' : ''}`}
                          onClick={() => toggleRegulator(regulator)}
                        >
                          <div className={`dropdown-checkbox ${selectedRegulators.includes(regulator) ? 'checked' : ''}`}>
                            {selectedRegulators.includes(regulator) ? (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <rect width="16" height="16" rx="2" fill="#1890ff"/>
                                <path d="M6 8l2 2 4-4" stroke="white" strokeWidth="2"/>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <rect width="16" height="16" rx="2" stroke="#7c858c" strokeWidth="1"/>
                              </svg>
                            )}
                          </div>
                          <span className="dropdown-item-text">{regulator}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Selected Regulators ({selectedRegulators.length}):</label>
                <div className="selected-chips">
                  {selectedRegulators.map((regulator, index) => (
                    <div key={index} className="chip">
                      <span>{regulator}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sources-section">
              <div className="sources-header">
                <span>Sources:</span>
                <span className="sources-count">
                  Total selected sources: {selectedRegulators.length} | 
                  Total selected documents: {(() => {
                    const allDocuments = selectedRegulators.flatMap(regulator => {
                      const data = allRegulatorData.get(regulator)
                      return data ? data.documents : []
                    })
                    return allDocuments.filter(doc => !doc.indented && selectedDocuments.has(doc.id)).length
                  })()}
                </span>
              </div>

              {getPaginatedRegulators().map(regulator => {
                const data = allRegulatorData.get(regulator)
                if (!data) return null
                
                return renderRegionSection(
                  data.name, 
                  regulator, 
                  data.documents, 
                  getSelectedCount(data.documents), 
                  getTotalCount(data.documents)
                )
              })}
              
              {/* Page indicator */}
              {selectedRegulators.length > regulatorsPerPage && (
                <div className="page-indicator">
                  <span>Page {currentPage} of {totalPages}</span>
                  <span>Showing {getPaginatedRegulators().length} of {selectedRegulators.length} regulators</span>
                </div>
              )}
            </div>

            {/* Pagination */}
            {selectedRegulators.length > regulatorsPerPage && (
              <div className="pagination">
                {/* Previous page */}
                <button 
                  className="pagination-btn"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  ⟨
                </button>
                
                {/* Page numbers */}
                {(() => {
                  const pages = []
                  const maxVisiblePages = 5
                  
                  if (totalPages <= maxVisiblePages) {
                    // Show all pages if total is 5 or less
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(
                        <button 
                          key={i}
                          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
                          onClick={() => handlePageChange(i)}
                        >
                          {i}
                        </button>
                      )
                    }
                  } else {
                    // Always show first page
                    pages.push(
                      <button 
                        key={1}
                        className={`pagination-btn ${1 === currentPage ? 'active' : ''}`}
                        onClick={() => handlePageChange(1)}
                      >
                        1
                      </button>
                    )
                    
                    // Calculate range to show around current page
                    let startPage = Math.max(2, currentPage - 1)
                    let endPage = Math.min(totalPages - 1, currentPage + 1)
                    
                    // Adjust if we're near the beginning
                    if (currentPage <= 3) {
                      endPage = Math.min(totalPages - 1, 4)
                    }
                    
                    // Adjust if we're near the end to keep current page centered
                    if (currentPage >= totalPages - 2) {
                      startPage = Math.max(2, totalPages - 3)
                      endPage = totalPages - 1
                    }
                    
                    // Special case for last page to ensure it's centered
                    if (currentPage === totalPages) {
                      startPage = Math.max(2, totalPages - 2)
                      endPage = totalPages - 1
                    }
                    
                    // Add ellipsis after first page if needed
                    if (startPage > 2) {
                      pages.push(<div key="ellipsis1" className="pagination-ellipsis">...</div>)
                    }
                    
                    // Add pages around current page
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button 
                          key={i}
                          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
                          onClick={() => handlePageChange(i)}
                        >
                          {i}
                        </button>
                      )
                    }
                    
                    // Add ellipsis before last page if needed
                    if (endPage < totalPages - 1) {
                      pages.push(<div key="ellipsis2" className="pagination-ellipsis">...</div>)
                    }
                    
                    // Always show last page
                    pages.push(
                      <button 
                        key={totalPages}
                        className={`pagination-btn ${totalPages === currentPage ? 'active' : ''}`}
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    )
                  }
                  
                  return pages
                })()}
                
                {/* Next page */}
                <button 
                  className="pagination-btn"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  ⟩
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-content">
            <span>© </span>
            <a href="#" className="footer-link">Corlytics</a>
            <span> 2025</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CorlyticsDashboard 