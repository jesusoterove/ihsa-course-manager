import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FomanticUIModule } from 'ngx-fomantic-ui';

import { AppComponent } from './app.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';

import { InMemoryCourseService } from './providers/in-memory-course.service';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { SafeHrefPipe } from './pipes/safe-href.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CourseListComponent,
    CourseDetailComponent,
    CourseEditComponent,
    SafeHrefPipe,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: 'courses', component: CourseListComponent },
      { path: 'courses/:id', component: CourseEditComponent },
      { path: '', redirectTo: '/courses', pathMatch: 'full' },
    ]),
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryCourseService, { delay: 500 }),
    FomanticUIModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
