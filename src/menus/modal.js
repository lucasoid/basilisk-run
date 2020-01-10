export function openModal() {
    document.getElementById('modal-wrap').style = 'display: block';
}

export function closeModal() {
    document.getElementById('modal-wrap').style = 'display: hidden';
    document.getElementById('modal-content').innerHTML = '';
    document.getElementById('modal-content').style = '';
}

export function renderModal({
    contentText = '',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm = () => closeModal(),
    onCancel = () => closeModal(),
}) {
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = contentText;

    const confirm = document.createElement('button');
    confirm.className = 'primary';
    confirm.innerHTML = confirmText;

    const cancel = document.createElement('button');
    cancel.className = 'secondary';
    cancel.innerHTML = cancelText;

    const buttonDiv = document.createElement('div');
    buttonDiv.className = 'modal-footer';
    buttonDiv.appendChild(cancel);
    buttonDiv.appendChild(confirm);

    const content = document.getElementById('modal-content');
    content.style = 'text-align: center';
    content.appendChild(contentDiv);
    content.appendChild(buttonDiv);

    confirm.addEventListener('click', function(evt) {
        onConfirm();
        closeModal();
    });

    cancel.addEventListener('click', function(evt) {
        onCancel();
        closeModal();
    });

    openModal();
}

document.getElementById('modal-close').addEventListener('click', function(evt) {
    closeModal();
});
