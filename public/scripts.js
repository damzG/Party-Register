function toggleFields() {
  const singleDiv = document.getElementById('singleName');
  const coupleDiv = document.getElementById('coupleNames');
  const isCouple = document.getElementById('couple').checked;

  if (isCouple) {
    // Show couple
    coupleDiv.classList.remove('hidden');
    coupleDiv.classList.add('opacity-100', 'transition-opacity', 'duration-300');
    
    singleDiv.classList.add('opacity-0');
    setTimeout(() => {
      singleDiv.classList.add('hidden');
      singleDiv.classList.remove('opacity-0', 'transition-opacity', 'duration-300');
    }, 300);
  } else {
    // Show single
    singleDiv.classList.remove('hidden');
    singleDiv.classList.add('opacity-100', 'transition-opacity', 'duration-300');

    coupleDiv.classList.add('opacity-0');
    setTimeout(() => {
      coupleDiv.classList.add('hidden');
      coupleDiv.classList.remove('opacity-0', 'transition-opacity', 'duration-300');
    }, 300);
  }
}



 async function submitForm(e) {
    e.preventDefault();

    const isCouple = document.getElementById('couple').checked;
    let data;

    if (isCouple) {
        const name1 = document.getElementById('name1').value.trim();
        const name2 = document.getElementById('name2').value.trim();

        if (!name1 || !name2) {
            return showMessage('❌ Please enter both names for a couple.', false);
        }

        data = { type: 'couple', names: [name1, name2] };
    } else {
        const singleName = document.getElementById('single1').value.trim();

        if (!singleName) {
            return showMessage('❌ Please enter your name.', false);
        }

        data = { type: 'single', names: [singleName] };
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('✅ ' + result.message, true);
            showPreview(data);
            document.querySelector('form').reset();
            toggleFields();
        } else {
            showMessage('❌ ' + result.error, false);
        }

    } catch (error) {
        showMessage('❌ Error submitting the form.', false);
    }
}


function showPreview(entry) {
    const preview = document.getElementById('preview');
    const div = document.createElement('div');
    div.innerHTML = `<strong>${entry.type.toUpperCase()}</strong>: ${entry.names.join(' & ')}`;
    preview.append(div);
}

function showMessage(message, isSuccess) {
  let msgDiv = document.getElementById('message');

  if (!msgDiv) {
    msgDiv = document.createElement('div');
    msgDiv.id = 'message';
    msgDiv.className = "max-w-lg mx-auto my-4 p-3 rounded text-center font-semibold text-white";
    msgDiv.setAttribute('aria-live', 'polite');
    document.body.insertBefore(msgDiv, document.getElementById('preview'));
  }

  msgDiv.textContent = message;

  if (isSuccess) {
    msgDiv.classList.remove('bg-red-600');
    msgDiv.classList.add('bg-green-600');
  } else {
    msgDiv.classList.remove('bg-green-600');
    msgDiv.classList.add('bg-red-600');
  }

  setTimeout(() => {
    msgDiv.remove();
  }, 3000);
}



async function fetchGuests() {
    try {
        const res = await fetch('/guests');
        const guests = await res.json();

        const preview = document.getElementById('preview');
        preview.innerHTML = '<h3>Registered Guests</h3>'; // clear previous

        guests.forEach(entry => {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${entry.type.toUpperCase()}</strong>: ${entry.names.join(' & ')}`;
            preview.appendChild(div);
        });
    } catch (err) {
        console.error('Error fetching guests:', err);
    }
}


