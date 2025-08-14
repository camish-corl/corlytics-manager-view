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
    // Add button action logic here
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
        <div className="region-header" onClick={() => toggleSection(regionName)}>
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
                <span>{regulator}</span>
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  {/* Main gear body with 10 rectangular teeth */}
                  <path d="M12 2L13.5 4.5L15.5 4.5L16.5 6.5L18.5 6.5L19.5 8.5L21.5 8.5L22.5 10.5L24 12L22.5 13.5L21.5 15.5L19.5 15.5L18.5 17.5L16.5 17.5L15.5 19.5L13.5 19.5L12 22L10.5 19.5L8.5 19.5L7.5 17.5L5.5 17.5L4.5 15.5L2.5 15.5L1.5 13.5L0 12L1.5 10.5L2.5 8.5L4.5 8.5L5.5 6.5L7.5 6.5L8.5 4.5L10.5 4.5L12 2Z" fill="#2c5c65"/>
                  {/* Central white hole */}
                  <circle cx="12" cy="12" r="3" fill="white"/>
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
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1
                  const isActive = pageNumber === currentPage
                  
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNumber === 1 || 
                    pageNumber === totalPages || 
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button 
                        key={pageNumber}
                        className={`pagination-btn ${isActive ? 'active' : ''}`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    )
                  } else if (
                    pageNumber === currentPage - 2 || 
                    pageNumber === currentPage + 2
                  ) {
                    return <div key={pageNumber} className="pagination-ellipsis">...</div>
                  }
                  return null
                })}
                
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