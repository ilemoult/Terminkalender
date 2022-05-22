export function el (css){
    return document.querySelector(css);
}

export function group (css){
    return document.querySelectorAll(css);
}

export function create (html){
    return document.createElement(html);
}

export async function loadJsons(url)
{
	return await (await fetch(url)).json(); // Promise unaufgelöst so can not be used
}

export function deepCopy(arr)
{
    return JSON.parse(JSON.stringify(arr));
}

// Install Button START
export function addButton(){
    
    let deferredPrompt;
    const addBtn = document.querySelector('.add-button');
    addBtn.style.display = 'none';

  
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('add-button')
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    addBtn.style.display = 'inline-block';
  
    addBtn.addEventListener('click', (e) => {
      // hide our user interface that shows our A2HS button
      addBtn.style.display = 'none';
      // Show the prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
          } else {
            console.log('User dismissed the A2HS prompt');
          }
          deferredPrompt = null;
        });
    });
  });
}
// Install Button ENDE
