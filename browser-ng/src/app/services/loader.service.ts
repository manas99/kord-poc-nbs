import { Injectable } from '@angular/core';

declare let $: any;
declare let bootstrap: any;

@Injectable({
	providedIn: 'root'
})
export class LoaderService {

	constructor() { }

	start() {
		$("#spinner-cont").removeClass('d-none')
		$("#spinner-cont").addClass('d-flex')
	}

	stop() {
		$("#spinner-cont").removeClass('d-flex')
		$("#spinner-cont").addClass('d-none')
	}

	showError(msg: string) {
		let html = '';
		html += '<div class="toast-container position-fixed bottom-0 end-0 p-3" id="toastPlacement">';
		html += '<div id="toast" class="toast align-items-center text-white bg-danger border-0 rounded-0" role="alert" aria-live="assertive" aria-atomic="true">';
		html += '<div class="d-flex">';
		html += '<div class="toast-body">' + msg + '</div>';
		html += '<button type="button" class="btn-close btn-close-white me-2 m-auto rounded-0" data-bs-dismiss="toast" aria-label="Close"></button>'
		html += '</div>'
		html += '</div>'
		html += '</div>'
		document.body.innerHTML += html;
		let toast = new bootstrap.Toast(document.getElementById('toast'));
		toast.show()
	}
}
