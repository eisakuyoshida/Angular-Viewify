import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSlideToggleModule, MatIconModule, MatInputModule, MatFormFieldModule, MatButtonModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

const modules = [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatButtonModule
];

@NgModule({
    imports: [
        modules
    ],
    exports: [
        modules
    ]
})
export class BaseStructuresModule {
}
