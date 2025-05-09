// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (header) {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(253, 246, 240, 0.9)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'transparent';
            header.style.boxShadow = 'none';
        }
    }
});

// Configuration de la pâtisserie
const whatsappNumber = "212766988501"; // Numéro WhatsApp de la pâtisserie
const shopName = "Drizzl Cookies"; // Nom de la pâtisserie

// Panier
let cart = [];

// Produits et leurs prix
const products = {
     " Milk Chocalate Chip Cookie": {
        price: 15.00,
        description: "Thick classic cookie, crunshy from edges, chewy in middle & sprinkled with fine sea salt",
        image: "cokies 1.png"
    },
    "Red Velvet Cookie": {
        price: 17.00,
        description: "A rich chocalate cookie with a creamy vanilla cream cheese frosting",
        image: "cokiees_2-removebg-preview.png"
    },
    "Cookie & Cream Milkshake Cookie": {
        price: 17.00,
        description: "A chill Cookie& Cream cookie, frosted with a vanilla Cookie& Cream milkshake insired frosting",
        image: "cokies_3-removebg-preview.png"
    },
    "Twix Cookie": {
        price: 17.00,
        description: "A shortbead cookie, topped with a gooey layer of caramel & a rich layer of chocolate milk",
        image: "cokies4-removebg-preview.png"
    },
    "Classic Pink Sugar": {
        price: 15.00,
        description: "Classic soft sugar cookie, glazed with a perfect swoop of vanilaa almond frosting",
        image: "cokies5-removebg-preview.png"
    }
};

// Éléments du DOM
const modal = document.getElementById('cart-modal');
const closeModal = document.querySelector('.close-modal');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart');
const sendWhatsappBtn = document.getElementById('send-whatsapp');

// Fonction pour ajouter un produit au panier
function addToCart(productName, price, button) {
    cart.push({ name: productName, price: price });
    updateCartCount();
    showNotification(`${productName} ajouté au panier!`);

    // Animation du bouton
    if (button) {
        button.classList.add('success');
        setTimeout(() => {
            button.classList.remove('success');
        }, 500);
    }

    // Sauvegarder le panier dans le localStorage
    saveCartToLocalStorage();
}

// Sauvegarder le panier
function saveCartToLocalStorage() {
    localStorage.setItem('drizzlCart', JSON.stringify(cart));
}

// Charger le panier
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('drizzlCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Mettre à jour l'affichage du nombre d'articles
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Afficher une notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Mettre à jour l'affichage du panier
function updateCartDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Votre panier est vide</div>';
        cartTotal.textContent = '0.00 DH';
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                </div>
                <div class="cart-item-remove" onclick="removeFromCart(${index})">×</div>
            </div>
        `;
    }).join('');

    cartTotal.textContent = formatPrice(total);
}

// Supprimer un article du panier
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
    saveCartToLocalStorage();
    showNotification("Article supprimé du panier");
}

// Vider le panier
function clearCart() {
    cart = [];
    updateCartCount();
    updateCartDisplay();
    saveCartToLocalStorage();
    showNotification("Panier vidé");
}

// Formatter le prix
function formatPrice(price) {
    return `${price.toFixed(2)} DH`;
}

// Envoyer la commande sur WhatsApp
function sendToWhatsApp() {
    if (cart.length === 0) {
        showNotification("Votre panier est vide");
        return;
    }

    let message = `🍪 *${shopName}*\n`;
    message += "━━━━━━━━━━━━━━━\n";
    message += "📝 *Nouvelle Commande*\n\n";
    
    let total = 0;
    
    // Liste des articles
    message += "🛒 *Articles commandés:*\n";
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   └ Prix: ${item.price} DH\n`;
        total += item.price;
    });

    // Total et informations
    message += "\n💰 *Total:* ";
    message += `${total.toFixed(2)} DH\n`;
    message += "━━━━━━━━━━━━━━━\n\n";
    
    // Informations client
    message += "📋 *Mes informations:*\n";
    message += "• Nom:\n";
    message += "• Téléphone:\n";
    message += "• Adresse de livraison:\n";
    message += "• Heure de livraison souhaitée:\n\n";
    
    // Informations de livraison
    message += "🚚 *Livraison:*\n";
    message += "• Délai: 24H\n";
    message += "• Zone: Rabat - Salé - Temara\n";

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    clearCart();
    modal.style.display = 'none';
    showNotification("Commande envoyée sur WhatsApp!");
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Charger le panier sauvegardé
    loadCartFromLocalStorage();

    // Ajouter le compteur du panier
    const commandeBtn = document.querySelector('.commande-btn');
    if (commandeBtn) {
        const cartCount = document.createElement('span');
        cartCount.id = 'cart-count';
        cartCount.className = 'cart-count';
        cartCount.textContent = cart.length.toString();
        commandeBtn.appendChild(cartCount);
    }

    // Ajouter les événements aux boutons de commande
    const orderButtons = document.querySelectorAll('.order-btn');
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.specialty-card');
            const productName = card.querySelector('h3').textContent;
            const product = products[productName];
            if (product) {
                addToCart(productName, product.price, this);
            }
        });
    });

    // Ouvrir le modal du panier
    if (commandeBtn) {
        commandeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            updateCartDisplay();
            modal.style.display = 'block';
        });
    }

    // Fermer le modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Clic en dehors du modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Vider le panier
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Envoyer sur WhatsApp
    if (sendWhatsappBtn) {
        sendWhatsappBtn.addEventListener('click', sendToWhatsApp);
    }

    // Gestion du formulaire Formspree
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Afficher un message de chargement
            const submitButton = this.querySelector('.submit-button');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Envoi en cours...';
            submitButton.disabled = true;

            try {
                const formData = new FormData(this);
                console.log('Données du formulaire:', Object.fromEntries(formData));

                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                console.log('Réponse du serveur:', response);

                if (response.ok) {
                    // Afficher un message de succès
                    showNotification('Votre demande a été envoyée avec succès! Nous vous contacterons bientôt.');
                    this.reset();
                } else {
                    const errorData = await response.json();
                    console.error('Erreur détaillée:', errorData);
                    throw new Error('Erreur lors de l\'envoi du formulaire: ' + (errorData.error || 'Erreur inconnue'));
                }
            } catch (error) {
                console.error('Erreur complète:', error);
                showNotification('Une erreur est survenue: ' + error.message);
            } finally {
                // Restaurer le bouton
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
}); 