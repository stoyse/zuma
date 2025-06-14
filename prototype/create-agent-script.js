document.addEventListener('DOMContentLoaded', function() {
            // Initialize jsPlumb
            const jsPlumbInstance = jsPlumb.getInstance({
                Connector: ["Bezier", { curviness: 60 }],
                ConnectionOverlays: [
                    ["Arrow", { 
                        location: 1,
                        id: "arrow",
                        width: 10,
                        length: 10
                    }]
                ],
                PaintStyle: { 
                    stroke: "#6c757d",
                    strokeWidth: 2 
                },
                HoverPaintStyle: { 
                    stroke: "#4e73df",
                    strokeWidth: 3
                },
                EndpointStyle: { 
                    fill: "#6c757d",
                    stroke: "#6c757d",
                    strokeWidth: 1,
                    radius: 5
                },
                EndpointHoverStyle: { 
                    fill: "#4e73df" 
                },
                Container: "canvas"
            });
    
            // Variables
            const canvas = document.getElementById('canvas');
            const canvasContainer = document.getElementById('canvasContainer');
            const propertiesPanel = document.getElementById('properties-panel');
            const closePropertiesBtn = document.getElementById('closeProperties');
            const zoomLevelDisplay = document.querySelector('.zoom-level');
            let zoomLevel = 1;
            let isDragging = false;
            let lastX, lastY;
            let selectedNode = null;
            let nodeCounter = 1;
            
            // Canvas pan functionality
            canvasContainer.addEventListener('mousedown', function(e) {
                // Only allow panning when clicking on the canvas background, not on nodes
                if (e.target === canvas || e.target === canvasContainer) {
                    isDragging = true;
                    lastX = e.clientX;
                    lastY = e.clientY;
                    canvasContainer.style.cursor = 'grabbing';
                    e.preventDefault();
                }
            });
            
            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                
                const dx = e.clientX - lastX;
                const dy = e.clientY - lastY;
                lastX = e.clientX;
                lastY = e.clientY;
                
                const rect = canvasContainer.getBoundingClientRect();
                const x = parseInt(canvas.style.left || 0) + dx;
                const y = parseInt(canvas.style.top || 0) + dy;
                
                canvas.style.left = x + 'px';
                canvas.style.top = y + 'px';
            });
            
            document.addEventListener('mouseup', function() {
                isDragging = false;
                canvasContainer.style.cursor = 'default';
            });
            
            // Zoom functionality
            document.getElementById('zoomIn').addEventListener('click', function() {
                zoomLevel = Math.min(zoomLevel + 0.1, 2);
                applyZoom();
            });
            
            document.getElementById('zoomOut').addEventListener('click', function() {
                zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
                applyZoom();
            });
            
            document.getElementById('zoomReset').addEventListener('click', function() {
                zoomLevel = 1;
                applyZoom();
                centerCanvas();
            });
            
            document.getElementById('centerCanvas').addEventListener('click', centerCanvas);
            
            function applyZoom() {
                canvas.style.transform = `scale(${zoomLevel})`;
                zoomLevelDisplay.textContent = `Zoom: ${Math.round(zoomLevel * 100)}%`;
            }
            
            function centerCanvas() {
                const containerWidth = canvasContainer.offsetWidth;
                const containerHeight = canvasContainer.offsetHeight;
                canvas.style.left = `${(containerWidth / 2) - 500}px`;
                canvas.style.top = `${(containerHeight / 2) - 300}px`;
            }
            
            // Initialize canvas position
            centerCanvas();
            
            // Make component items draggable
            const componentItems = document.querySelectorAll('.component-item');
            componentItems.forEach(item => {
                item.addEventListener('mousedown', function(e) {
                    // Create ghost element for dragging
                    const ghost = document.createElement('div');
                    ghost.className = 'component-item';
                    ghost.innerHTML = this.innerHTML;
                    ghost.style.position = 'absolute';
                    ghost.style.opacity = '0.8';
                    ghost.style.zIndex = '1000';
                    ghost.style.width = this.offsetWidth + 'px';
                    ghost.style.pointerEvents = 'none';
                    document.body.appendChild(ghost);
                    
                    const initialX = e.clientX;
                    const initialY = e.clientY;
                    const offsetX = e.offsetX;
                    const offsetY = e.offsetY;
                    
                    ghost.style.left = (initialX - offsetX) + 'px';
                    ghost.style.top = (initialY - offsetY) + 'px';
                    
                    const nodeType = this.getAttribute('data-type');
                    const nodeSubtype = this.getAttribute('data-subtype');
                    
                    // Mouse move for dragging ghost element
                    const mouseMoveHandler = function(e) {
                        ghost.style.left = (e.clientX - offsetX) + 'px';
                        ghost.style.top = (e.clientY - offsetY) + 'px';
                    };
                    
                    // Mouse up for dropping and creating node
                    const mouseUpHandler = function(e) {
                        document.removeEventListener('mousemove', mouseMoveHandler);
                        document.removeEventListener('mouseup', mouseUpHandler);
                        
                        document.body.removeChild(ghost);
                        
                        // Check if dropped inside canvas container
                        const containerRect = canvasContainer.getBoundingClientRect();
                        if (
                            e.clientX > containerRect.left && 
                            e.clientX < containerRect.right && 
                            e.clientY > containerRect.top && 
                            e.clientY < containerRect.bottom
                        ) {
                            // Calculate position on canvas considering zoom and pan
                            const canvasRect = canvas.getBoundingClientRect();
                            const canvasX = (e.clientX - canvasRect.left) / zoomLevel;
                            const canvasY = (e.clientY - canvasRect.top) / zoomLevel;
                            
                            createNode(nodeType, nodeSubtype, canvasX, canvasY);
                        }
                    };
                    
                    document.addEventListener('mousemove', mouseMoveHandler);
                    document.addEventListener('mouseup', mouseUpHandler);
                });
            });
            
            // Create node on canvas
            function createNode(nodeType, nodeSubtype, x, y) {
                const node = document.createElement('div');
                node.className = `node ${nodeType}`;
                node.id = `node-${nodeCounter++}`;
                node.dataset.type = nodeType;
                node.dataset.subtype = nodeSubtype;
                
                const nodeHeader = document.createElement('div');
                nodeHeader.className = 'node-header';
                
                const nodeTitle = document.createElement('span');
                nodeTitle.textContent = getNodeDisplayName(nodeSubtype);
                nodeHeader.appendChild(nodeTitle);
                
                const nodeActions = document.createElement('span');
                nodeActions.innerHTML = '<i class="fas fa-cog node-config"></i>';
                nodeHeader.appendChild(nodeActions);
                
                const nodeContent = document.createElement('div');
                nodeContent.className = 'node-content';
                nodeContent.innerHTML = `<small>${getNodeDescription(nodeSubtype)}</small>`;
                
                const nodeControls = document.createElement('div');
                nodeControls.className = 'node-controls';
                nodeControls.innerHTML = `
                    <button class="node-control-btn duplicate"><i class="fas fa-copy"></i></button>
                    <button class="node-control-btn delete"><i class="fas fa-trash"></i></button>
                `;
                
                node.appendChild(nodeHeader);
                node.appendChild(nodeContent);
                node.appendChild(nodeControls);
                
                node.style.left = x + 'px';
                node.style.top = y + 'px';
                
                canvas.appendChild(node);
                
                // Make node draggable
                makeNodeDraggable(node);
                
                // Add endpoints based on node type
                if (nodeType !== 'input-node') {
                    addEndpoint(node.id, 'input');
                }
                
                if (nodeType !== 'output-node') {
                    addEndpoint(node.id, 'output');
                }
                
                // Setup event listeners
                setupNodeEventListeners(node);
                
                // Show properties panel for the newly created node
                showNodeProperties(node);
                
                // Refresh jsPlumb to detect the new endpoints
                jsPlumbInstance.repaintEverything();
            }
            
            // Make node draggable on canvas
            function makeNodeDraggable(node) {
                jsPlumbInstance.draggable(node, {
                    grid: [10, 10],
                    containment: 'parent',
                    start: function() {
                        selectNode(node);
                    }
                });
            }
            
            // Add endpoint to node
            function addEndpoint(nodeId, type) {
                let params = {
                    endpoint: "Dot",
                    isSource: type === 'output',
                    isTarget: type === 'input',
                    maxConnections: type === 'input' ? 1 : -1,
                    anchor: type === 'input' ? "Left" : "Right"
                };
                
                jsPlumbInstance.addEndpoint(nodeId, params, {
                    cssClass: `endpoint ${type}`
                });
            }
            
            // Setup node event listeners
            function setupNodeEventListeners(node) {
                node.addEventListener('click', function(e) {
                    e.stopPropagation();
                    selectNode(node);
                });
                
                const configBtn = node.querySelector('.node-config');
                if (configBtn) {
                    configBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        showNodeProperties(node);
                    });
                }
                
                const deleteBtn = node.querySelector('.delete');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        deleteNode(node);
                    });
                }
                
                const duplicateBtn = node.querySelector('.duplicate');
                if (duplicateBtn) {
                    duplicateBtn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        duplicateNode(node);
                    });
                }
            }
            
            // Select node
            function selectNode(node) {
                // Deselect previously selected node
                if (selectedNode) {
                    selectedNode.classList.remove('selected');
                }
                
                // Select new node
                node.classList.add('selected');
                selectedNode = node;
            }
            
            // Show node properties panel
            function showNodeProperties(node) {
                const nodeType = node.dataset.type;
                const nodeSubtype = node.dataset.subtype;
                selectNode(node);
                
                // Generate properties form based on node type
                const propertiesForm = generatePropertiesForm(nodeType, nodeSubtype);
                
                // Add properties to panel
                document.getElementById('node-properties').innerHTML = propertiesForm;
                propertiesPanel.classList.add('active');
                
                // Setup form event listeners
                setupPropertiesFormEventListeners(node);
            }
            
            // Generate properties form based on node type
            function generatePropertiesForm(nodeType, nodeSubtype) {
                // Different form fields for different node types
                switch(nodeType) {
                    case 'input-node':
                        return `
                            <div class="form-group">
                                <label class="form-label">Node Name</label>
                                <input type="text" class="form-control" id="node-name" placeholder="Enter node name" value="${getNodeDisplayName(nodeSubtype)}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Connection Details</label>
                                <textarea class="form-control" id="connection-details" rows="3" placeholder="Enter connection details"></textarea>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Authentication</label>
                                <select class="form-select" id="auth-type">
                                    <option>None</option>
                                    <option>API Key</option>
                                    <option>OAuth</option>
                                    <option>Basic Auth</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Output Format</label>
                                <select class="form-select" id="output-format">
                                    <option>JSON</option>
                                    <option>Text</option>
                                    <option>XML</option>
                                    <option>CSV</option>
                                </select>
                            </div>
                        `;
                        
                    case 'ai-node':
                        return `
                            <div class="form-group">
                                <label class="form-label">Node Name</label>
                                <input type="text" class="form-control" id="node-name" placeholder="Enter node name" value="${getNodeDisplayName(nodeSubtype)}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">AI Provider</label>
                                <select class="form-select" id="ai-provider">
                                    <option>OpenAI</option>
                                    <option>Google AI</option>
                                    <option>Anthropic</option>
                                    <option>Hugging Face</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Model</label>
                                <select class="form-select" id="ai-model">
                                    <option>GPT-4</option>
                                    <option>GPT-3.5 Turbo</option>
                                    <option>Claude</option>
                                    <option>PaLM</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Temperature</label>
                                <input type="range" class="form-range" id="temperature" min="0" max="1" step="0.1" value="0.7">
                                <div class="d-flex justify-content-between">
                                    <small>Precise</small>
                                    <small>Creative</small>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">System Prompt</label>
                                <textarea class="form-control" id="system-prompt" rows="4" placeholder="Enter system instructions"></textarea>
                            </div>
                        `;
                        
                    case 'process-node':
                        return `
                            <div class="form-group">
                                <label class="form-label">Node Name</label>
                                <input type="text" class="form-control" id="node-name" placeholder="Enter node name" value="${getNodeDisplayName(nodeSubtype)}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Processing Logic</label>
                                <textarea class="form-control" id="process-logic" rows="6" placeholder="Enter processing logic or code"></textarea>
                            </div>
                            <div class="form-check mb-3">
                                <input type="checkbox" class="form-check-input" id="error-handling">
                                <label class="form-check-label" for="error-handling">Enable error handling</label>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Execution Order</label>
                                <select class="form-select" id="execution-order">
                                    <option>Sequential</option>
                                    <option>Parallel</option>
                                </select>
                            </div>
                        `;
                        
                    case 'output-node':
                        return `
                            <div class="form-group">
                                <label class="form-label">Node Name</label>
                                <input type="text" class="form-control" id="node-name" placeholder="Enter node name" value="${getNodeDisplayName(nodeSubtype)}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Destination</label>
                                <input type="text" class="form-control" id="destination" placeholder="Enter destination">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Output Format</label>
                                <select class="form-select" id="output-format">
                                    <option>JSON</option>
                                    <option>Text</option>
                                    <option>HTML</option>
                                    <option>Markdown</option>
                                </select>
                            </div>
                            <div class="form-check mb-3">
                                <input type="checkbox" class="form-check-input" id="send-immediately">
                                <label class="form-check-label" for="send-immediately">Send immediately</label>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Response Template</label>
                                <textarea class="form-control" id="response-template" rows="5" placeholder="Enter response template"></textarea>
                            </div>
                        `;
                        
                    default:
                        return `<div class="alert alert-info">No properties available for this node type.</div>`;
                }
            }
            
            // Set up event listeners for the properties form
            function setupPropertiesFormEventListeners(node) {
                // Example: Update node name when the form field changes
                const nameField = document.getElementById('node-name');
                if (nameField) {
                    nameField.addEventListener('change', function() {
                        const headerTitle = node.querySelector('.node-header span');
                        if (headerTitle) {
                            headerTitle.textContent = this.value;
                        }
                    });
                }
                
                // Add more event listeners for other form fields
            }
            
            // Close properties panel
            closePropertiesBtn.addEventListener('click', function() {
                propertiesPanel.classList.remove('active');
            });
            
            // Delete selected node
            document.getElementById('deleteSelected').addEventListener('click', function() {
                if (selectedNode) {
                    deleteNode(selectedNode);
                }
            });
            
            // Delete node
            function deleteNode(node) {
                // Remove all connections
                jsPlumbInstance.removeAllEndpoints(node.id);
                // Remove the node
                node.parentNode.removeChild(node);
                // Clear selected node if this was the selected one
                if (selectedNode === node) {
                    selectedNode = null;
                    propertiesPanel.classList.remove('active');
                }
            }
            
            // Duplicate node
            function duplicateNode(node) {
                const nodeType = node.dataset.type;
                const nodeSubtype = node.dataset.subtype;
                const rect = node.getBoundingClientRect();
                const canvasRect = canvas.getBoundingClientRect();
                
                const offsetX = 20;
                const offsetY = 20;
                const x = (rect.left - canvasRect.left) / zoomLevel + offsetX;
                const y = (rect.top - canvasRect.top) / zoomLevel + offsetY;
                
                createNode(nodeType, nodeSubtype, x, y);
            }
            
            // Toggle sidebar
            document.getElementById('sidebarToggle').addEventListener('click', function() {
                const sidebar = document.querySelector('.sidebar');
                const mainContent = document.querySelector('.main-content');
                
                if (sidebar.style.marginLeft === '-250px') {
                    sidebar.style.marginLeft = '0';
                    mainContent.style.marginLeft = 'var(--sidebar-width)';
                } else {
                    sidebar.style.marginLeft = '-250px';
                    mainContent.style.marginLeft = '0';
                }
            });
            
            // Search components
            document.getElementById('componentSearch').addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const items = document.querySelectorAll('.component-item');
                
                items.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
            
            // Helper functions
            function getNodeDisplayName(subtype) {
                switch(subtype) {
                    case 'database': return 'Database';
                    case 'api': return 'API';
                    case 'file': return 'File';
                    case 'webhook': return 'Webhook';
                    case 'llm': return 'Language Model';
                    case 'image': return 'Image Model';
                    case 'classifier': return 'Classifier';
                    case 'vector-db': return 'Vector Database';
                    case 'filter': return 'Filter';
                    case 'transform': return 'Transform';
                    case 'merge': return 'Merge';
                    case 'condition': return 'Condition';
                    case 'response': return 'Response';
                    case 'email': return 'Email';
                    case 'notification': return 'Notification';
                    case 'webhook-out': return 'Webhook';
                    default: return 'Node';
                }
            }
            
            function getNodeDescription(subtype) {
                switch(subtype) {
                    case 'database': return 'Connect to a database source';
                    case 'api': return 'Fetch data from an API';
                    case 'file': return 'Read from file system';
                    case 'webhook': return 'Listen for incoming data';
                    case 'llm': return 'Process text with language model';
                    case 'image': return 'Generate or analyze images';
                    case 'classifier': return 'Categorize incoming data';
                    case 'vector-db': return 'Query vector database';
                    case 'filter': return 'Filter data based on conditions';
                    case 'transform': return 'Transform data format';
                    case 'merge': return 'Combine multiple inputs';
                    case 'condition': return 'Branch based on conditions';
                    case 'response': return 'Return response to user';
                    case 'email': return 'Send email notification';
                    case 'notification': return 'Send system notification';
                    case 'webhook-out': return 'Send data to external service';
                    default: return 'Process node';
                }
            }
            
            // Add a sample node to get started
            createNode('input-node', 'webhook', 300, 200);
            createNode('ai-node', 'llm', 600, 200);
            createNode('output-node', 'response', 900, 200);
            
            // Connect the sample nodes
            setTimeout(() => {
                jsPlumbInstance.connect({
                    source: 'node-1',
                    target: 'node-2'
                });
                jsPlumbInstance.connect({
                    source: 'node-2',
                    target: 'node-3'
                });
            }, 500);
        });