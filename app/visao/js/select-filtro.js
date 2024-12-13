function adicionarFiltro(buscaID, selectID) {
    const searchBox = document.querySelector('#' + buscaID); 
    const options = document.querySelectorAll('#' + selectID + ' option'); 
    const selectedOption = document.querySelector('.selected-option'); 
    const clearButton = document.getElementById('clear-button'); 
    
    // Check if search country present in menu list 
    searchBox.addEventListener('input', () => { 
        const searchTerm = searchBox.value.toLowerCase(); 
    
        options.forEach(option => { 
            const text = option.textContent.toLowerCase(); 
            if (text.includes(searchTerm)) { 
                option.style.display = 'block'; 
            } else { 
                option.style.display = 'none'; 
            } 
        }); 
    }); 
} 