import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { CourseService } from '../providers/course.service';
import { MessagingService } from '../providers/messaging.service';
import { Course } from '../models/course';
import { Attachment } from '../models/attachment';

const MAX_FILE_SIZE = 250 * 1024;

@Component({
  selector: '[app-course-detail]',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  @Input() course: Course;
  @Output() deleted = new EventEmitter<Course>();

  constructor(private courseService: CourseService,
    private messageService: MessagingService) { }

  ngOnInit(): void {
  }

  /*
  Fired when a file is selected for upload
  */
  onFileChange(event) {
    let files = event.target.files;

    if (!files.length) return;

    //Get the first file from the selected files array
    let file = files[0];

    //Check the document size is not greater than the maximum allowed
    if (file.size > MAX_FILE_SIZE) {
      alert('Document size cannot be more than 250 KB');
      return;
    }

    //Construct a file reader for the file being uploaded
    let reader = new FileReader();
    reader.onload = () => {
      //Create an attachment object to be asigned to the course
      let attachment:Attachment = {
        filename: file.name,
        size: file.size,
        type: file.type,
        blob: reader.result.toString()
      };
      //Make a copy of the course object
      let course = Object.assign({}, this.course);
      course.doc = attachment;

      //Attempt to update the course
      this.courseService.update(course).subscribe(result => {
        //If the update succeeds, update the in memory object and publish a success message
        if (result != null) {
          this.course.doc = attachment;
          this.messageService.sendMessage({text: `Document ${file.name} has been succesfully attached to ${course.name} course`, type: 'success' });
        }
      });
    }
    //Start reading the attachment
    reader.readAsDataURL(file);
    
  }

  /*
  To delete a course after user confirmation
  */
  delete() {
    //Ask the user for confirmation on the delete
    if (!confirm('Are you sure you want to delete this course?')) return;
    //Call the service delete course method
    this.courseService.delete(this.course.id).subscribe(deleted => {
      //If deleted, publish a deletion message and notify the parent component of the deletion
      if (deleted) {
        this.messageService.sendMessage({text: `${this.course.name} course has been removed from the system`, type: 'warning' });
        this.deleted.emit(this.course)
      }
    });
  }
}

