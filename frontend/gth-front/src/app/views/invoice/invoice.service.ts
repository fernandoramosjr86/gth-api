import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InvoiceDB } from '../../shared/inmemory-db/invoices';
import { Observable, delay, of } from 'rxjs';
import { Invoice } from 'app/shared/models/invoice.model';

@Injectable({
  providedIn: 'root'
})

export class InvoiceService {

  constructor(private http: HttpClient) { }

  getInvoiceList(): Observable<Invoice[]> {
    return of(InvoiceDB.invoices)
    // return this.http.get('/api/invoices/');
  }

  getInvoiceById(id): Observable<Invoice> {
    let invoice: Invoice = InvoiceDB.invoices.find((inv: Invoice) => inv.id == id)
    return of(invoice);
    // return this.http.get('/api/invoices/'+id);
  }
  
  saveInvoice(invoice) {
    if(invoice.id) {
      const updatedList = InvoiceDB.invoices.map(inv => {
        if(inv.id === invoice.id) {
          return invoice;
        }
        return inv;
      });
      InvoiceDB.invoices = [...updatedList];
      return of(invoice).pipe(delay(400));
      // return this.http.put('/api/invoices/'+invoice.id, invoice);
    } else {
      invoice.id = (Math.random() * 1000000000).toString();
      InvoiceDB.invoices.push(invoice);
      return of(invoice);
      // return this.http.post('/api/invoices/', invoice);
    }
  }

  deleteInvoice(id) {
    const updatedList = InvoiceDB.invoices.filter(inv => inv.id !== id);
    InvoiceDB.invoices = [...updatedList];
    return of(true);
    // return this.http.delete('/api/invoices/'+id);
  }

}
