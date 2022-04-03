import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AppModule } from '../app.module';
import { SharedModule } from '../shared/shared.module';
import { ProjectLayoutComponent } from './layouts/project-layout/project-layout.component';
import { AccordionModule } from 'primeng/accordion';
import { VerticalFilterBarComponent } from './vertical-filter-bar/vertical-filter-bar.component';
import { FilterResultsComponent } from './filter-results/filter-results.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
@NgModule({
  declarations: [
    ProjectLayoutComponent
    // AuthLayoutComponent,
    // VerticalFilterBarComponent,
    // FilterResultsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    // AppModule,
    AccordionModule,
    NgxSkeletonLoaderModule
  ]
})
export class CoreModule { }