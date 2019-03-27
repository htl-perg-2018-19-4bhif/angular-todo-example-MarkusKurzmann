//Create an Angular-Component
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatIconModule, MatIcon } from '@angular/material';
import {MatDialogModule, MatDialogRef, MatDialog} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import {CreateToDoDialog} from './app.component';

@NgModule({
  imports:      [ BrowserModule, 
                  BrowserAnimationsModule,
                  MatTableModule,
                  MatPaginatorModule,
                  MatButtonModule,
                  MatCheckboxModule,
                  FormsModule,
                  ReactiveFormsModule,
                  HttpClientModule,
                  MatDialogModule,
                  MatFormFieldModule,
                  MatFormFieldModule,
                  MatInputModule,
                  MatSelectModule,
                  MatDatepickerModule,
                  MatNativeDateModule,
                  MatIconModule],
  exports: [
                    MatTableModule,
                    MatPaginatorModule,
                    MatButtonModule,
                    MatCheckboxModule,
                    FormsModule,
                    MatFormFieldModule,
                    MatSelectModule,
                    MatDatepickerModule,
                    MatNativeDateModule,
                    MatIconModule
                  ],
  declarations: [ AppComponent, CreateToDoDialog ],
  bootstrap:    [ AppComponent ],
  providers: [MatDialogModule, MatDatepickerModule],
  entryComponents: [AppComponent,CreateToDoDialog]
})
export class AppModule { }

