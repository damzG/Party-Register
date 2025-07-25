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
      // Check if message exists before displaying it
      const message = result.message || 'Guest registered successfully!';
      showMessage('✅ ' + message, true);

      // Don't call showPreview if it's commented
      // showPreview(data);

      document.querySelector('form').reset();
      toggleFields();
    } else {
      const errorMsg = result.error || 'An error occurred.';
      showMessage('❌ ' + errorMsg, false);
    }

  } catch (error) {
    console.error('Submission error:', error);
    showMessage('❌ Error submitting the form.', false);
  }
}



// function showPreview(entry) {
//     const preview = document.getElementById('preview');
//     const div = document.createElement('div');
//     div.innerHTML = `<strong>${entry.type.toUpperCase()}</strong>: ${entry.names.join(' & ')}`;
//     preview.append(div);
// }

function showMessage(message, isSuccess) {
  let msgDiv = document.getElementById('message');

  if (!msgDiv) {
    msgDiv = document.createElement('div');
    msgDiv.id = 'message';
    msgDiv.className = "max-w-lg mx-auto my-4 p-3 rounded text-center font-semibold text-white";
    msgDiv.setAttribute('aria-live', 'polite');

    // Only insert if #preview exists
    const preview = document.getElementById('preview');
    if (preview) {
      document.body.insertBefore(msgDiv, preview);
    } else {
      document.body.appendChild(msgDiv);
    }
  }

  msgDiv.textContent = message;
  msgDiv.classList.toggle('bg-green-600', isSuccess);
  msgDiv.classList.toggle('bg-red-600', !isSuccess);

  setTimeout(() => msgDiv.remove(), 3000);
}




async function fetchGuests() {
  const preview = document.getElementById('preview');
  if (!preview) return; // Exit if preview is commented out

  try {
    const res = await fetch('/guests');
    const guests = await res.json();

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



