// ===== CONFIGURACIÓN DE PAYPAL =====
// IMPORTANTE: Reemplaza 'TU_CLIENT_ID_AQUI' con tu Client ID real de PayPal
// Para obtenerlo: 
// 1. Ve a https://developer.paypal.com/
// 2. Inicia sesión con tu cuenta PayPal
// 3. Ve a "My Apps & Credentials"
// 4. Crea una nueva app o usa una existente
// 5. Copia el Client ID (usa el de producción cuando estés listo)

const PAYPAL_CLIENT_ID = 'TU_CLIENT_ID_AQUI'; // Reemplazar con tu Client ID real

// Montos predefinidos para donaciones
const DONATION_AMOUNTS = {
    small: 10,
    medium: 25,
    large: 50,
    extraLarge: 100
};

// Proyectos disponibles para donación
const PROJECTS = {
    general: {
        es: 'Donación General - Voces de Mujeres Unidas',
        en: 'General Donation - Voices of United Women',
        de: 'Allgemeine Spende - Stimme der Vereinigten Frauen'
    },
    project1: {
        es: 'Ayuda integral a familias',
        en: 'Comprehensive family assistance',
        de: 'Umfassende Hilfe für Familien'
    },
    project2: {
        es: 'Museo histórico Villa Baviera',
        en: 'Villa Baviera Historical Museum',
        de: 'Historisches Museum Villa Baviera'
    },
    project3: {
        es: 'Nueva Aldea sostenible',
        en: 'New sustainable village',
        de: 'Nachhaltiges neues Dorf'
    }
};

// ===== CREAR MODAL DE DONACIÓN =====
function createDonationModal() {
    const modal = document.createElement('div');
    modal.id = 'donationModal';
    modal.className = 'donation-modal';
    modal.innerHTML = `
        <div class="donation-modal-content">
            <span class="close-modal">&times;</span>
            <h2 id="modal-title">Hacer una Donación</h2>
            <p id="modal-subtitle">Tu apoyo transforma vidas en Villa Baviera</p>
            
            <div class="donation-project-info">
                <label id="project-label">Proyecto:</label>
                <p id="selected-project">Donación General</p>
            </div>
            
            <div class="donation-amounts">
                <h3 id="amount-title">Selecciona el monto:</h3>
                <div class="amount-buttons">
                    <button class="amount-btn" data-amount="10">$10 USD</button>
                    <button class="amount-btn" data-amount="25">$25 USD</button>
                    <button class="amount-btn active" data-amount="50">$50 USD</button>
                    <button class="amount-btn" data-amount="100">$100 USD</button>
                </div>
                <div class="custom-amount-container">
                    <label for="custom-amount" id="custom-label">O ingresa otro monto (USD):</label>
                    <input type="number" id="custom-amount" min="1" placeholder="Ej: 75">
                </div>
            </div>
            
            <div class="donor-info">
                <h3 id="donor-title">Información del donante (opcional):</h3>
                <input type="text" id="donor-name" placeholder="Nombre completo">
                <input type="email" id="donor-email" placeholder="Correo electrónico">
                <textarea id="donor-message" placeholder="Mensaje (opcional)" rows="3"></textarea>
            </div>
            
            <div id="paypal-button-container"></div>
            
            <div class="security-note">
                <p id="security-text">🔒 Pago seguro procesado por PayPal</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Agregar estilos CSS para el modal
    const style = document.createElement('style');
    style.textContent = `
        .donation-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.6);
            animation: fadeIn 0.3s;
        }
        
        .donation-modal-content {
            background: var(--secondary-medium, #3E3B31);
            margin: 50px auto;
            padding: 30px;
            border: 2px solid var(--accent-gold, #C9B050);
            border-radius: 15px;
            width: 90%;
            max-width: 500px;
            position: relative;
            animation: slideDown 0.3s;
            color: var(--text-primary, #EAEAC4);
        }
        
        .close-modal {
            color: var(--accent-gold, #C9B050);
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.3s;
        }
        
        .close-modal:hover {
            color: #B8A045;
        }
        
        .donation-modal h2 {
            color: var(--text-primary, #EAEAC4);
            font-family: var(--font-heading, 'Playfair Display', serif);
            font-size: 2rem;
            margin-bottom: 10px;
        }
        
        .donation-modal p {
            color: var(--text-primary, #EAEAC4);
            margin-bottom: 20px;
            opacity: 0.9;
        }
        
        .donation-project-info {
            background: rgba(201, 176, 80, 0.1);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            border: 1px solid rgba(201, 176, 80, 0.3);
        }
        
        .donation-project-info label {
            color: var(--accent-gold, #C9B050);
            font-weight: 600;
            margin-right: 10px;
        }
        
        .donation-project-info p {
            margin: 5px 0;
            font-size: 1.1rem;
        }
        
        .donation-amounts h3 {
            color: var(--text-primary, #EAEAC4);
            font-size: 1.1rem;
            margin-bottom: 15px;
        }
        
        .amount-buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .amount-btn {
            background: transparent;
            border: 2px solid var(--accent-gold, #C9B050);
            color: var(--accent-gold, #C9B050);
            padding: 12px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .amount-btn:hover {
            background: rgba(201, 176, 80, 0.2);
        }
        
        .amount-btn.active {
            background: var(--accent-gold, #C9B050);
            color: var(--neutral-dark, #1F1F14);
        }
        
        .custom-amount-container {
            margin-bottom: 20px;
        }
        
        .custom-amount-container label {
            display: block;
            color: var(--text-primary, #EAEAC4);
            margin-bottom: 8px;
            font-size: 0.9rem;
        }
        
        #custom-amount {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--accent-gold, #C9B050);
            border-radius: 8px;
            background: rgba(31, 31, 20, 0.5);
            color: var(--text-primary, #EAEAC4);
            font-size: 1rem;
        }
        
        .donor-info {
            margin-bottom: 20px;
        }
        
        .donor-info h3 {
            color: var(--text-primary, #EAEAC4);
            font-size: 1.1rem;
            margin-bottom: 15px;
        }
        
        .donor-info input,
        .donor-info textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid var(--accent-gold, #C9B050);
            border-radius: 8px;
            background: rgba(31, 31, 20, 0.5);
            color: var(--text-primary, #EAEAC4);
            font-size: 0.95rem;
        }
        
        .donor-info input::placeholder,
        .donor-info textarea::placeholder {
            color: rgba(234, 234, 196, 0.5);
        }
        
        #paypal-button-container {
            margin: 20px 0;
            min-height: 150px;
        }
        
        .security-note {
            text-align: center;
            padding-top: 15px;
            border-top: 1px solid rgba(201, 176, 80, 0.3);
        }
        
        .security-note p {
            font-size: 0.85rem;
            color: var(--accent-gold, #C9B050);
            margin: 0;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideDown {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @media (max-width: 480px) {
            .amount-buttons {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .donation-modal-content {
                margin: 20px auto;
                padding: 20px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// ===== FUNCIONES DE TRADUCCIÓN =====
function updateModalLanguage(lang) {
    const translations = {
        es: {
            modalTitle: 'Hacer una Donación',
            modalSubtitle: 'Tu apoyo transforma vidas en Villa Baviera',
            projectLabel: 'Proyecto:',
            amountTitle: 'Selecciona el monto:',
            customLabel: 'O ingresa otro monto (USD):',
            donorTitle: 'Información del donante (opcional):',
            namePlaceholder: 'Nombre completo',
            emailPlaceholder: 'Correo electrónico',
            messagePlaceholder: 'Mensaje (opcional)',
            securityText: '🔒 Pago seguro procesado por PayPal'
        },
        en: {
            modalTitle: 'Make a Donation',
            modalSubtitle: 'Your support transforms lives in Villa Baviera',
            projectLabel: 'Project:',
            amountTitle: 'Select amount:',
            customLabel: 'Or enter another amount (USD):',
            donorTitle: 'Donor information (optional):',
            namePlaceholder: 'Full name',
            emailPlaceholder: 'Email',
            messagePlaceholder: 'Message (optional)',
            securityText: '🔒 Secure payment processed by PayPal'
        },
        de: {
            modalTitle: 'Spenden',
            modalSubtitle: 'Ihre Unterstützung verändert Leben in Villa Baviera',
            projectLabel: 'Projekt:',
            amountTitle: 'Betrag auswählen:',
            customLabel: 'Oder anderen Betrag eingeben (USD):',
            donorTitle: 'Spenderinformationen (optional):',
            namePlaceholder: 'Vollständiger Name',
            emailPlaceholder: 'E-Mail',
            messagePlaceholder: 'Nachricht (optional)',
            securityText: '🔒 Sichere Zahlung über PayPal'
        }
    };
    
    const t = translations[lang] || translations.es;
    
    document.getElementById('modal-title').textContent = t.modalTitle;
    document.getElementById('modal-subtitle').textContent = t.modalSubtitle;
    document.getElementById('project-label').textContent = t.projectLabel;
    document.getElementById('amount-title').textContent = t.amountTitle;
    document.getElementById('custom-label').textContent = t.customLabel;
    document.getElementById('donor-title').textContent = t.donorTitle;
    document.getElementById('donor-name').placeholder = t.namePlaceholder;
    document.getElementById('donor-email').placeholder = t.emailPlaceholder;
    document.getElementById('donor-message').placeholder = t.messagePlaceholder;
    document.getElementById('security-text').textContent = t.securityText;
}

// ===== INICIALIZAR PAYPAL =====
function initializePayPal(projectId = 'general') {
    const container = document.getElementById('paypal-button-container');
    container.innerHTML = ''; // Limpiar contenedor
    
    // Obtener monto seleccionado
    let selectedAmount = 50; // Monto por defecto
    
    // Si PayPal no está cargado, mostrar mensaje
    if (typeof paypal === 'undefined') {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px; color: var(--accent-gold);">
                <p>⚠️ PayPal no está configurado correctamente.</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">
                    Por favor, reemplaza TU_CLIENT_ID_AQUI con tu Client ID de PayPal en el archivo paypal-integration.js
                </p>
            </div>
        `;
        return;
    }
    
    // Renderizar botones de PayPal
    paypal.Buttons({
        createOrder: function(data, actions) {
            // Obtener monto actual
            const customAmount = document.getElementById('custom-amount').value;
            const activeBtn = document.querySelector('.amount-btn.active');
            
            if (customAmount && customAmount > 0) {
                selectedAmount = parseFloat(customAmount);
            } else if (activeBtn) {
                selectedAmount = parseFloat(activeBtn.dataset.amount);
            }
            
            // Obtener idioma actual
            const lang = localStorage.getItem('selectedLanguage') || 'es';
            const projectName = PROJECTS[projectId][lang];
            
            // Obtener información del donante
            const donorName = document.getElementById('donor-name').value;
            const donorEmail = document.getElementById('donor-email').value;
            const donorMessage = document.getElementById('donor-message').value;
            
            return actions.order.create({
                purchase_units: [{
                    description: projectName,
                    amount: {
                        currency_code: 'USD',
                        value: selectedAmount.toFixed(2)
                    },
                    custom_id: projectId,
                    soft_descriptor: 'VOCES MUJERES'
                }],
                application_context: {
                    brand_name: 'Voces de Mujeres Unidas',
                    locale: lang === 'es' ? 'es_ES' : (lang === 'de' ? 'de_DE' : 'en_US'),
                    shipping_preference: 'NO_SHIPPING'
                }
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Donación exitosa
                const lang = localStorage.getItem('selectedLanguage') || 'es';
                const messages = {
                    es: `¡Gracias ${details.payer.name.given_name}! Tu donación de $${selectedAmount} USD ha sido recibida exitosamente. Tu apoyo es fundamental para transformar vidas en Villa Baviera.`,
                    en: `Thank you ${details.payer.name.given_name}! Your donation of $${selectedAmount} USD has been successfully received. Your support is essential to transform lives in Villa Baviera.`,
                    de: `Danke ${details.payer.name.given_name}! Ihre Spende von $${selectedAmount} USD wurde erfolgreich empfangen. Ihre Unterstützung ist entscheidend für die Veränderung von Leben in Villa Baviera.`
                };
                
                alert(messages[lang]);
                
                // Cerrar modal
                document.getElementById('donationModal').style.display = 'none';
                
                // Aquí podrías enviar información adicional a tu servidor
                // para registrar la donación en tu base de datos
            });
        },
        onError: function(err) {
            console.error('Error en PayPal:', err);
            const lang = localStorage.getItem('selectedLanguage') || 'es';
            const messages = {
                es: 'Hubo un error al procesar tu donación. Por favor, intenta nuevamente.',
                en: 'There was an error processing your donation. Please try again.',
                de: 'Bei der Verarbeitung Ihrer Spende ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
            };
            alert(messages[lang]);
        },
        onCancel: function(data) {
            const lang = localStorage.getItem('selectedLanguage') || 'es';
            const messages = {
                es: 'Has cancelado la donación. Si deseas apoyarnos, puedes intentarlo nuevamente cuando gustes.',
                en: 'You have cancelled the donation. If you wish to support us, you can try again whenever you like.',
                de: 'Sie haben die Spende abgebrochen. Wenn Sie uns unterstützen möchten, können Sie es jederzeit erneut versuchen.'
            };
            console.log('Donación cancelada:', data);
        }
    }).render('#paypal-button-container');
}

// ===== ABRIR MODAL DE DONACIÓN =====
function openDonationModal(projectId = 'general') {
    const modal = document.getElementById('donationModal');
    const lang = localStorage.getItem('selectedLanguage') || 'es';
    
    // Actualizar proyecto seleccionado
    document.getElementById('selected-project').textContent = PROJECTS[projectId][lang];
    
    // Actualizar idioma del modal
    updateModalLanguage(lang);
    
    // Mostrar modal
    modal.style.display = 'block';
    
    // Inicializar PayPal
    initializePayPal(projectId);
}

// ===== CONFIGURAR EVENT LISTENERS =====
function setupDonationListeners() {
    // Crear modal si no existe
    if (!document.getElementById('donationModal')) {
        createDonationModal();
    }
    
    // Cerrar modal
    document.querySelector('.close-modal').onclick = function() {
        document.getElementById('donationModal').style.display = 'none';
    }
    
    // Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
        const modal = document.getElementById('donationModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    
    // Botones de monto
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('custom-amount').value = '';
        });
    });
    
    // Campo de monto personalizado
    document.getElementById('custom-amount').addEventListener('input', function() {
        if (this.value > 0) {
            document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
        }
    });
    
    // Reemplazar los event listeners existentes de los botones de donación
    document.querySelectorAll('.btn-donate').forEach(btn => {
        btn.removeEventListener('click', btn.clickHandler); // Remover handler anterior si existe
        btn.clickHandler = function(e) {
            e.preventDefault();
            openDonationModal('general');
        };
        btn.addEventListener('click', btn.clickHandler);
    });
    
    // Botones de proyectos específicos
    const projectButtons = {
        'project-1-btn': 'project1',
        'project-2-btn': 'project2',
        'project-3-btn': 'project3'
    };
    
    Object.keys(projectButtons).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.removeEventListener('click', btn.clickHandler); // Remover handler anterior si existe
            btn.clickHandler = function(e) {
                e.preventDefault();
                openDonationModal(projectButtons[btnId]);
            };
            btn.addEventListener('click', btn.clickHandler);
        }
    });
}

// ===== CARGAR SCRIPT DE PAYPAL =====
function loadPayPalScript() {
    if (PAYPAL_CLIENT_ID === 'TU_CLIENT_ID_AQUI') {
        console.warn('⚠️ PayPal Client ID no configurado. Por favor, actualiza PAYPAL_CLIENT_ID en paypal-integration.js');
        // Aún así configurar los listeners para mostrar el mensaje de error
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupDonationListeners);
        } else {
            setupDonationListeners();
        }
        return;
    }
    
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&locale=es_ES`;
    script.async = true;
    
    script.onload = function() {
        console.log('✅ PayPal SDK cargado exitosamente');
        setupDonationListeners();
    };
    
    script.onerror = function() {
        console.error('❌ Error al cargar PayPal SDK');
        setupDonationListeners(); // Configurar listeners de todos modos
    };
    
    document.head.appendChild(script);
}

// ===== INICIALIZAR AL CARGAR LA PÁGINA =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPayPalScript);
} else {
    loadPayPalScript();
}
