// Dashboard Registro JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // Variables globales
  let currentSection = "clientes"
  let editingId = null
  let clientes = []
  let choferes = []
  let vendedores = []
  let inventario = []
  let despachos = []
  let disenosDisponibles = []

  // Inicializar dashboard
  init()

  function init() {
    setupEventListeners()
    loadInitialData()
    showSection("clientes") // Mostrar clientes por defecto
  }

  function setupEventListeners() {
    // Event listeners para navegación
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.addEventListener("click", function (e) {
        e.preventDefault()
        const section = this.getAttribute("data-section")
        showSection(section)
      })
    })

    // Event listeners para modales
    setupModalEventListeners()

    // Event listeners para formularios
    setupFormEventListeners()

    // Event listener para logout
    const logoutBtn = document.getElementById("logoutBtn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout)
    }
  }

  function setupModalEventListeners() {
    // Cerrar modales
    document.querySelectorAll(".modal .close, .modal .btn-secondary").forEach((btn) => {
      btn.addEventListener("click", function () {
        const modal = this.closest(".modal")
        closeModal(modal.id)
      })
    })

    // Cerrar modal al hacer click fuera
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", function (e) {
        if (e.target === this) {
          closeModal(this.id)
        }
      })
    })
  }

  function setupFormEventListeners() {
    // Formulario de clientes
    const clienteForm = document.getElementById("clienteForm")
    if (clienteForm) {
      clienteForm.addEventListener("submit", handleClienteSubmit)
    }

    // Formulario de choferes
    const choferForm = document.getElementById("choferForm")
    if (choferForm) {
      choferForm.addEventListener("submit", handleChoferSubmit)
    }

    // Formulario de vendedores
    const vendedorForm = document.getElementById("vendedorForm")
    if (vendedorForm) {
      vendedorForm.addEventListener("submit", handleVendedorSubmit)
    }

    // Formulario de inventario
    const inventarioForm = document.getElementById("inventarioForm")
    if (inventarioForm) {
      inventarioForm.addEventListener("submit", handleInventarioSubmit)
    }

    // Formulario de despachos
    const despachoForm = document.getElementById("despachoForm")
    if (despachoForm) {
      despachoForm.addEventListener("submit", handleDespachoSubmit)
    }
  }

  async function loadInitialData() {
    try {
      await Promise.all([
        loadClientes(),
        loadChoferes(),
        loadVendedores(),
        loadInventario(),
        loadDespachos(),
        loadDisenos(),
      ])

      // Cargar alertas después de cargar los datos
      loadAlertas()
    } catch (error) {
      console.error("Error loading initial data:", error)
      showNotification("Error al cargar datos iniciales", "error")
    }
  }

  // Funciones de navegación
  function showSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll(".content-section").forEach((sec) => {
      sec.style.display = "none"
    })

    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(section + "Section")
    if (targetSection) {
      targetSection.style.display = "block"
    }

    // Actualizar navegación activa
    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active")
    })

    const activeNavItem = document.querySelector(`[data-section="${section}"]`)
    if (activeNavItem) {
      activeNavItem.classList.add("active")
    }

    currentSection = section

    // Cargar datos específicos de la sección si es necesario
    switch (section) {
      case "clientes":
        loadClientes()
        break
      case "choferes":
        loadChoferes()
        break
      case "vendedores":
        loadVendedores()
        break
      case "inventario":
        loadInventario()
        loadInventarioDisenos()
        break
      case "despachos":
        loadDespachos()
        break
    }
  }

  // Funciones para clientes
  async function loadClientes() {
    try {
      const response = await fetch("/api/clientes")
      if (response.ok) {
        clientes = await response.json()
        renderClientesTable()
      } else {
        throw new Error("Error al cargar clientes")
      }
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al cargar clientes", "error")
    }
  }

  function renderClientesTable() {
    const tbody = document.querySelector("#clientesTable tbody")
    if (!tbody) return

    tbody.innerHTML = ""

    clientes.forEach((cliente) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${cliente.nombre}</td>
                <td>${cliente.direccion}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.documento}</td>
                <td>${cliente.vendedor_nombre || "Sin asignar"}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editCliente(${cliente.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCliente(${cliente.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `
      tbody.appendChild(row)
    })
  }

  async function handleClienteSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const url = editingId ? `/api/clientes/${editingId}` : "/api/clientes"

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        closeModal("clienteModal")
        loadClientes()
        showNotification(editingId ? "Cliente actualizado" : "Cliente registrado", "success")
        editingId = null
      } else {
        throw new Error("Error al guardar cliente")
      }
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al guardar cliente", "error")
    }
  }

  window.editCliente = async (id) => {
    try {
      const response = await fetch(`/api/clientes/${id}`)
      if (response.ok) {
        const cliente = await response.json()

        // Llenar el formulario
        document.getElementById("clienteNombre").value = cliente.nombre
        document.getElementById("clienteDireccion").value = cliente.direccion
        document.getElementById("clienteTelefono").value = cliente.telefono
        document.getElementById("clienteDocumento").value = cliente.documento
        document.getElementById("clienteVendedor").value = cliente.vendedor_id || ""

        editingId = id
        openModal("clienteModal")
      }
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al cargar cliente", "error")
    }
  }

  window.deleteCliente = (id) => {
    if (confirm("¿Está seguro de que desea eliminar este cliente?")) {
      const form = document.createElement("form")
      form.method = "POST"
      form.action = `/api/clientes/delete/${id}`
      document.body.appendChild(form)
      form.submit()
    }
  }

  // Funciones para choferes
  async function loadChoferes() {
    try {
      const response = await fetch("/api/choferes")
      if (response.ok) {
        choferes = await response.json()
        renderChoferesTable()
      } else {
        throw new Error("Error al cargar choferes")
      }
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al cargar choferes", "error")
    }
  }

  function renderChoferesTable() {
    const tbody = document.querySelector("#choferesTable tbody")
    if (!tbody) return

    tbody.innerHTML = ""

    choferes.forEach((chofer) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${chofer.nombre}</td>
                <td>${chofer.cedula}</td>
                <td>${chofer.licencia}</td>
                <td>${formatDate(chofer.vencimiento_licencia)}</td>
                <td>${chofer.certificado_medico}</td>
                <td>${formatDate(chofer.vencimiento_certificado)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editChofer(${chofer.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteChofer(${chofer.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `
      tbody.appendChild(row)
    })
  }

  async function handleChoferSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const url = editingId ? `/api/choferes/${editingId}` : "/api/choferes"

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        closeModal("choferModal")
        loadChoferes()
        showNotification(editingId ? "Chofer actualizado" : "Chofer registrado", "success")
        editingId = null
      } else {
        throw new Error("Error al guardar chofer")
      }
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al guardar chofer", "error")
    }
  }

  window.editChofer = async (id) => {
    try {
      const response = await fetch(`/api/choferes/${id}`)
      if (response.ok) {
        const chofer = await response.json()

        // Llenar el formulario
        document.getElementById("choferNombre").value = chofer.nombre
        document.getElementById("choferCedula").value = chofer.cedula
        document.getElementById("choferLicencia").value = chofer.licencia
        document.getElementById("choferVencimientoLicencia").value = chofer.vencimiento_licencia
        document.getElementById("choferCertificadoMedico").value = chofer.certificado_medico
        document.getElementById("choferVencimientoCertificado").value = chofer.vencimiento_certificado

        editingId = id
        openModal("choferModal")
      }
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al cargar chofer", "error")
    }
  }

  window.deleteChofer = (id) => {
    if (confirm("¿Está seguro de que desea eliminar este chofer?")) {
      const form = document.createElement("form")
      form.method = "POST"
      form.action = `/api/choferes/delete/${id}`
      document.body.appendChild(form)
      form.submit()
    }
  }

  // Funciones para vendedores
  async function loadVendedores() {
    try {
      const response = await fetch("/api/vendedores")
      if (response.ok) {
        vendedores = await response.json()
        renderVendedoresTable()
        updateVendedorSelects()
      } else {
        throw new Error("Error al cargar vendedores")
      }
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al cargar vendedores", "error")
    }
  }

  function renderVendedoresTable() {
    const tbody = document.querySelector("#vendedoresTable tbody")
    if (!tbody) return

    tbody.innerHTML = ""

    vendedores.forEach((vendedor) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${vendedor.nombre}</td>
                <td>${vendedor.cedula}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editVendedor(${vendedor.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteVendedor(${vendedor.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `
      tbody.appendChild(row)
    })
  }

  function updateVendedorSelects() {
    const selects = document.querySelectorAll('select[name="vendedor"]')
    selects.forEach((select) => {
      const currentValue = select.value
      select.innerHTML = '<option value="">Seleccionar vendedor</option>'
      vendedores.forEach((vendedor) => {
        const option = document.createElement("option")
        option.value = vendedor.id
        option.textContent = vendedor.nombre
        if (vendedor.id == currentValue) {
          option.selected = true
        }
        select.appendChild(option)
      })
    })
  }

  async function handleVendedorSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const url = editingId ? `/api/vendedores/${editingId}` : "/api/vendedores"

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        closeModal("vendedorModal")
        loadVendedores()
        showNotification(editingId ? "Vendedor actualizado" : "Vendedor registrado", "success")
        editingId = null
      } else {
        throw new Error("Error al guardar vendedor")
      }
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al guardar vendedor", "error")
    }
  }

  window.editVendedor = async (id) => {
    try {
      const response = await fetch(`/api/vendedores/${id}`)
      if (response.ok) {
        const vendedor = await response.json()

        // Llenar el formulario
        document.getElementById("vendedorNombre").value = vendedor.nombre
        document.getElementById("vendedorCedula").value = vendedor.cedula

        editingId = id
        openModal("vendedorModal")
      }
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al cargar vendedor", "error")
    }
  }

  window.deleteVendedor = (id) => {
    if (confirm("¿Está seguro de que desea eliminar este vendedor?")) {
      const form = document.createElement("form")
      form.method = "POST"
      form.action = `/api/vendedores/delete/${id}`
      document.body.appendChild(form)
      form.submit()
    }
  }

  // Funciones para inventario
  async function loadInventario() {
    try {
      const response = await fetch("/api/inventario")
      if (response.ok) {
        inventario = await response.json()
        renderInventarioTable()
      } else {
        throw new Error("Error al cargar inventario")
      }
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al cargar inventario", "error")
    }
  }

  function renderInventarioTable() {
    const tbody = document.querySelector("#inventarioTable tbody")
    if (!tbody) return

    tbody.innerHTML = ""

    inventario.forEach((item) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${item.nombre}</td>
                <td>${Number.parseFloat(item.cantidad).toFixed(2)}</td>
                <td>${item.unidad}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editInventario(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteInventario(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `
      tbody.appendChild(row)
    })
  }

  async function loadInventarioDisenos() {
    try {
      const response = await fetch("/api/inventario/disenos")
      if (response.ok) {
        const disenosInventario = await response.json()
        renderInventarioDisenos(disenosInventario)
      }
    } catch (error) {
      console.error("Error al cargar inventario de diseños:", error)
    }
  }

  function renderInventarioDisenos(disenosInventario) {
    const container = document.getElementById("disenosInventario")
    if (!container) return

    container.innerHTML = ""

    Object.entries(disenosInventario).forEach(([disenoId, diseno]) => {
      const card = document.createElement("div")
      card.className = `diseno-card ${diseno.estado}`

      let estadoIcon = ""
      let estadoClass = ""

      switch (diseno.estado) {
        case "disponible":
          estadoIcon = "✅"
          estadoClass = "text-success"
          break
        case "limitado":
          estadoIcon = "⚠️"
          estadoClass = "text-warning"
          break
        case "agotado":
          estadoIcon = "❌"
          estadoClass = "text-danger"
          break
      }

      card.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">${diseno.nombre}</h6>
                        <p class="card-text">
                            <span class="${estadoClass}">
                                ${estadoIcon} ${diseno.estado_texto}
                            </span>
                        </p>
                        <small class="text-muted">
                            Disponible: ${diseno.m3_posibles} m³<br>
                            ${diseno.limitante ? `Limitado por: ${diseno.limitante}` : ""}
                        </small>
                    </div>
                </div>
            `

      container.appendChild(card)
    })
  }

  async function handleInventarioSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const url = editingId ? `/api/inventario/${editingId}` : "/api/inventario"

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        closeModal("inventarioModal")
        loadInventario()
        loadInventarioDisenos() // Actualizar también el inventario de diseños
        showNotification(editingId ? "Inventario actualizado" : "Material registrado", "success")
        editingId = null
      } else {
        throw new Error("Error al guardar inventario")
      }
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al guardar inventario", "error")
    }
  }

  window.editInventario = async (id) => {
    try {
      const response = await fetch(`/api/inventario/${id}`)
      if (response.ok) {
        const item = await response.json()

        // Llenar el formulario
        document.getElementById("inventarioNombre").value = item.nombre
        document.getElementById("inventarioCantidad").value = item.cantidad

        editingId = id
        openModal("inventarioModal")
      }
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al cargar item de inventario", "error")
    }
  }

  window.deleteInventario = (id) => {
    if (confirm("¿Está seguro de que desea eliminar este item del inventario?")) {
      const form = document.createElement("form")
      form.method = "POST"
      form.action = `/api/inventario/delete/${id}`
      document.body.appendChild(form)
      form.submit()
    }
  }

  // Funciones para despachos
  async function loadDespachos() {
    try {
      const response = await fetch("/api/despachos")
      if (response.ok) {
        despachos = await response.json()
        renderDespachosTable()
      } else {
        throw new Error("Error al cargar despachos")
      }
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al cargar despachos", "error")
    }
  }

  function renderDespachosTable() {
    const tbody = document.querySelector("#despachosTable tbody")
    if (!tbody) return

    tbody.innerHTML = ""

    despachos.forEach((despacho) => {
      const row = document.createElement("tr")
      row.innerHTML = `
                <td>${formatDate(despacho.fecha)}</td>
                <td>${despacho.guia}</td>
                <td>${despacho.m3}</td>
                <td>${despacho.resistencia}</td>
                <td>${despacho.cliente_nombre || "N/A"}</td>
                <td>${despacho.chofer_nombre || "N/A"}</td>
                <td>${despacho.vendedor_nombre || "N/A"}</td>
            `
      tbody.appendChild(row)
    })
  }

  async function loadDisenos() {
    try {
      const response = await fetch("/api/disenos")
      if (response.ok) {
        disenosDisponibles = await response.json()
        updateDisenoSelects()
      }
    } catch (error) {
      console.error("Error al cargar diseños:", error)
    }
  }

  function updateDisenoSelects() {
    const selects = document.querySelectorAll('select[name="diseno"]')
    selects.forEach((select) => {
      const currentValue = select.value
      select.innerHTML = '<option value="">Seleccionar diseño</option>'
      disenosDisponibles.forEach((diseno) => {
        const option = document.createElement("option")
        option.value = diseno.id
        option.textContent = `${diseno.nombre} (${diseno.m3_disponibles} m³ disponibles)`
        option.disabled = !diseno.disponible
        if (diseno.id === currentValue) {
          option.selected = true
        }
        select.appendChild(option)
      })
    })
  }

  async function handleDespachoSubmit(e) {
    e.preventDefault()

    const formData = new FormData(e.target)

    try {
      const response = await fetch("/api/despachos", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        closeModal("despachoModal")
        loadDespachos()
        loadInventario() // Recargar inventario después del despacho
        loadInventarioDisenos() // Actualizar inventario de diseños
        showNotification("Despacho registrado exitosamente", "success")
      } else {
        throw new Error("Error al registrar despacho")
      }
    } catch (error) {
      console.error("Error:", error)
      showNotification("Error al registrar despacho", "error")
    }
  }

  // Funciones para alertas
  async function loadAlertas() {
    try {
      const [alertasInventario, alertasDisenos] = await Promise.all([
        fetch("/api/alertas/inventario").then((r) => r.json()),
        fetch("/api/alertas/disenos").then((r) => r.json()),
      ])

      renderAlertas([...alertasInventario, ...alertasDisenos])
    } catch (error) {
      console.error("Error al cargar alertas:", error)
    }
  }

  function renderAlertas(alertas) {
    const container = document.getElementById("alertasContainer")
    if (!container) return

    container.innerHTML = ""

    if (alertas.length === 0) {
      container.innerHTML = '<div class="alert alert-success">No hay alertas pendientes</div>'
      return
    }

    alertas.forEach((alerta) => {
      const alertDiv = document.createElement("div")
      alertDiv.className = `alert alert-${alerta.tipo === "critico" ? "danger" : "warning"}`
      alertDiv.innerHTML = `
                <strong>${alerta.tipo === "critico" ? "CRÍTICO" : "ADVERTENCIA"}:</strong>
                ${alerta.mensaje || `${alerta.diseno} - ${alerta.m3_disponibles} m³ disponibles`}
            `
      container.appendChild(alertDiv)
    })
  }

  // Funciones de utilidad
  function openModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.style.display = "block"
      document.body.classList.add("modal-open")
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.style.display = "none"
      document.body.classList.remove("modal-open")

      // Limpiar formulario
      const form = modal.querySelector("form")
      if (form) {
        form.reset()
      }

      editingId = null
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES")
  }

  function showNotification(message, type = "info") {
    // Crear elemento de notificación
    const notification = document.createElement("div")
    notification.className = `alert alert-${type} notification`
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideIn 0.3s ease-out;
        `
    notification.innerHTML = `
            ${message}
            <button type="button" class="close" onclick="this.parentElement.remove()">
                <span>&times;</span>
            </button>
        `

    document.body.appendChild(notification)

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, 5000)
  }

  async function logout() {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      })

      if (response.ok) {
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  // Funciones globales para botones
  window.openAddClienteModal = () => {
    editingId = null
    document.getElementById("clienteForm").reset()
    openModal("clienteModal")
  }

  window.openAddChoferModal = () => {
    editingId = null
    document.getElementById("choferForm").reset()
    openModal("choferModal")
  }

  window.openAddVendedorModal = () => {
    editingId = null
    document.getElementById("vendedorForm").reset()
    openModal("vendedorModal")
  }

  window.openAddInventarioModal = () => {
    editingId = null
    document.getElementById("inventarioForm").reset()
    openModal("inventarioModal")
  }

  window.openAddDespachoModal = () => {
    document.getElementById("despachoForm").reset()
    loadDisenos() // Recargar diseños disponibles
    openModal("despachoModal")
  }

  // Actualizar datos cada 30 segundos
  setInterval(() => {
    if (currentSection === "inventario") {
      loadInventarioDisenos()
      loadAlertas()
    }
  }, 30000)

  console.log("Dashboard Registro JS loaded successfully")
})

// Estilos CSS adicionales
const style = document.createElement("style")
style.textContent = `
    .notification {
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .diseno-card {
        margin-bottom: 15px;
    }

    .diseno-card.disponible .card {
        border-left: 4px solid #28a745;
    }

    .diseno-card.limitado .card {
        border-left: 4px solid #ffc107;
    }

    .diseno-card.agotado .card {
        border-left: 4px solid #dc3545;
    }

    .modal-open {
        overflow: hidden;
    }

    .nav-item.active {
        background-color: #007bff;
        color: white;
    }

    .content-section {
        display: none;
    }

    .content-section.active {
        display: block;
    }

    .btn-sm {
        margin: 0 2px;
    }

    .table th {
        background-color: #f8f9fa;
        font-weight: 600;
    }

    .alert {
        margin-bottom: 10px;
    }

    .card-body h6 {
        margin-bottom: 10px;
        font-weight: 600;
    }

    .text-success {
        color: #28a745 !important;
    }

    .text-warning {
        color: #ffc107 !important;
    }

    .text-danger {
        color: #dc3545 !important;
    }
`

document.head.appendChild(style)
