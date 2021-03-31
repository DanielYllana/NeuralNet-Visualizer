import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DiagramModule } from '@syncfusion/ej2-angular-diagrams';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './auth.component';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: AuthComponent }]),
    SharedModule,
    ReactiveFormsModule,
    MatIconModule,
    ButtonModule,
    DiagramModule,
  ],
})
export class AuthModule {}
