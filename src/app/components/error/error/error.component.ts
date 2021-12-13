import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }, private modalService: NgbModal) { }
  @ViewChild('unknwonErrorModal', { static: true }) deleteModal!: ElementRef;

  // Show the modal on initiation
  ngOnInit() {
    this.modalService.open(this.deleteModal, { ariaLabelledBy: 'modal-basic-title', centered: true });
  }

}
