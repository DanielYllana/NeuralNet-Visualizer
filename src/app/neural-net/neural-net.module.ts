import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HidLayerComponent } from './hid-layer/hid-layer.component';
import { InLayerComponent } from './in-layer/in-layer.component';
import { NeuralNetComponent } from './neural-net.component';
import { OutLayerComponent } from './out-layer/out-layer.component';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { enableRipple } from '@syncfusion/ej2-base';
import { CommonModule } from '@angular/common';
import { DiagramModule } from '@syncfusion/ej2-angular-diagrams';

enableRipple(true);

@NgModule({
  declarations: [
    NeuralNetComponent,
    OutLayerComponent,
    InLayerComponent,
    HidLayerComponent,
  ],
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatIconModule,
    ButtonModule,
    CommonModule,
    DiagramModule,
    FormsModule,
  ],
})
export class NeuralNetModule {}
