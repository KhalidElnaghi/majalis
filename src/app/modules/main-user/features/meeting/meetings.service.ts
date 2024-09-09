import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../../core/services/authentication.service';
import { HttpService } from '../../../../core/services/http.service';

import { MAIN_MJALES_API, MAIN_STORAGE_API } from '../../main.api';
import {
  CreateMeetingServerResponse,
  CommitteeSingleMeeting,
  CommitteeMeetingsList,
  Meeting,
  Member,
  MeetingTopic,
  MeetingMinuteData,
  Occurrence,
} from '../../main.types';
@Injectable({
  providedIn: 'root',
})
export class MeetingsService {
  auth = inject(AuthenticationService);
  HTTP = inject(HttpService);
  httpClient = inject(HttpClient);
  formBuilder = inject(FormBuilder);

  meetingsList = signal<Meeting[]>([]);

  selection = new SelectionModel<Meeting>(true, []);

  get allSelected() {
    return this.selection.selected.length === this.meetingsList().length;
  }

  toggleAll(isChecked: boolean): void {
    if (isChecked) {
      this.selection.select(...this.meetingsList());
    } else {
      this.selection.clear();
    }
  }

  toggleItem(meeting: Meeting): void {
    this.selection.toggle(meeting);
  }

  getCommitteeMeetingsList(
    committeeId: string,
    pageIndex = 0,
    MaxResultCount = 10,
    Sorting = 'Date DESC',
    Title = '',
    Status = '',
    Date = ''
  ) {
    return this.HTTP.getData<CommitteeMeetingsList>(
      MAIN_MJALES_API.COMMITTEE_MEETINGS_LIST(committeeId),
      {
        SkipCount: pageIndex * MaxResultCount,
        MaxResultCount,
        Sorting,
        Title,
        Status,
        Date,
      }
    );
  }

  saveAsDraft(committeeId: string, data: any) {
    return this.HTTP.sendData<any, CreateMeetingServerResponse>(
      MAIN_MJALES_API.CREATE_MEETING(committeeId),
      data
    );
  }

  seperateInvitees = (members: Member[]) => {
    const internalInvitees: Member[] = [];
    const externalInvitees: { memberId: string }[] = [];

    members.forEach((member) => {
      if (member?.memberType && member.memberType === 'EXTERNAL') {
        externalInvitees.push({ memberId: member.id });
      } else {
        internalInvitees.push({
          id: member.id,
          name: member.name,
          username: member.username,
          email: member.email,
          phone: member.phone,
        } as Member);
      }
    });

    return {
      internalInvitees,
      externalInvitees,
    };
  };

  getMeetingData(meetingId: string) {
    return this.HTTP.getData<CommitteeSingleMeeting>(
      MAIN_MJALES_API.SINGLE_MEETING(meetingId)
    );
  }

  validateMeeting(meetingId: string) {
    return this.HTTP.sendData(MAIN_MJALES_API.MEETING_VALIDATE(meetingId), {});
  }
  validateUpdateMeeting(meetingId: string, occurrenceId: string, data: any) {
    return this.HTTP.updateData(
      'put',
      MAIN_MJALES_API.MEETING_VALIDATE_UPDATE(meetingId, occurrenceId),
      data
    );
  }

  generateMeetingTopic(topic: MeetingTopic | Record<string, any> = {}) {
    return this.formBuilder.group({
      id: [topic.id || null],
      title: [topic.title || '', [Validators.required]],
      attachments: [topic.attachments || []],
      choices: [topic.choices || []],
      otherChoice: [topic.otherChoice || false],
      choiceName: [''],
      active: [topic.id ? false : true],
    });
  }

  addMeetingTopic(id: string, data: any) {
    return this.HTTP.sendData<any, any>(
      MAIN_MJALES_API.ADD_MEETING_TOPIC(id),
      data
    );
  }
  editMeetingTopic(occorrenceId: string, topicId: string, data: any) {
    return this.HTTP.updateData(
      'put',
      MAIN_MJALES_API.EDIT_MEETING_TOPIC(occorrenceId, topicId),
      data
    );
  }
  deleteMeetingTopic(occorrenceId: string, topicId: string) {
    return this.HTTP.deleteData(
      MAIN_MJALES_API.DELETE_MEETING_TOPIC(occorrenceId, topicId)
    );
  }
  saveVoteSettings(occorrenceId: string, data: any) {
    return this.HTTP.sendData<any, any>(
      MAIN_MJALES_API.SAVE_MEETING_VOTE_SETTINGS(occorrenceId),
      data
    );
  }

  getTopicsResult(meetingId: string) {
    return this.HTTP.getData<any>(MAIN_MJALES_API.TOPICS_RESULT(meetingId));
  }

  uploadCommitteeDocuments(committeeId: string, data: any) {
    const document = {
      title: data.title.replace('pdf', ''),
      url: data.url,
      type: data.type,
    };

    return this.HTTP.sendData<any>(
      MAIN_MJALES_API.UPLOAD_COMMITTEE_DOCUMENTS(committeeId),
      document
    );
  }

  getCommitteeDocuments(committeeId: string) {
    return this.HTTP.getData<any>(
      MAIN_MJALES_API.COMMITTEE_DOCUMENTS(committeeId)
    );
  }

  deleteCommitteeDocument(committeeId: string, documentId: string) {
    return this.HTTP.deleteData(
      MAIN_MJALES_API.DELETE_COMMITTEE_DOCUMENT(committeeId, documentId)
    );
  }

  createMeetingMinute(occurrenceId: string, data: Partial<MeetingMinuteData>) {
    return this.HTTP.sendData<Partial<MeetingMinuteData>, MeetingMinuteData>(
      MAIN_MJALES_API.GET_CREATE_MEETING_MINUTE(occurrenceId),
      data
    );
  }
  getMeetingMinute(occurrenceId: string) {
    return this.HTTP.getData<MeetingMinuteData>(
      MAIN_MJALES_API.GET_CREATE_MEETING_MINUTE(occurrenceId)
    );
  }

  getCommitteePreviousMeetingMinutes(committeeId: string) {
    return this.HTTP.getData<any>(
      MAIN_MJALES_API.COMMITTEE_PREVIOUS_MEETING_MINUTES(committeeId)
    );
  }

  uploadCommitteePreviousMeetingMinutes(committeeId: string, data: any) {
    const document = {
      recordText: data.title.replace('pdf', ''),
      recordPdfUrl: data.url,
    };

    return this.HTTP.sendData<any>(
      MAIN_MJALES_API.COMMITTEE_PREVIOUS_MEETING_MINUTES(committeeId),
      document
    );
  }
  deleteMeetingOccurrence(occurrenceId: string) {
    return this.HTTP.deleteData(
      MAIN_MJALES_API.DELETE_MEETING_OCCURRENCE(occurrenceId)
    );
  }

  getMyMeetingList(
    pageIndex = 0,
    MaxResultCount = 10,
    Title = '',
    Date = '',
    Status = '',
    Sorting = 'Date DESC'
  ) {
    return this.HTTP.getData<CommitteeMeetingsList>(
      MAIN_MJALES_API.MY_MEETING_LIST,
      {
        SkipCount: pageIndex * MaxResultCount,
        MaxResultCount,
        Title,
        Date,
        Status,
        Sorting,
      }
    );
  }
  getOccurrenceData(occurrenceId: string) {
    return this.HTTP.getData<Occurrence>(
      MAIN_MJALES_API.GET_OCCURRENCE_DATA(occurrenceId)
    );
  }
  editOccurrenceInfo(
    meetingId: string,
    occurrenceId: string,
    reqBody: Partial<Meeting>
  ) {
    return this.HTTP.updateData(
      'put',
      MAIN_MJALES_API.EDIT_OCCURRENCE_INFO(meetingId, occurrenceId),
      reqBody
    );
  }
  deleteMinutesDocuments(id: string, isManual = false) {
    const reqURL = isManual
      ? MAIN_MJALES_API.DELETE_MANUAL_UPLOADED_MINUTES(id)
      : MAIN_MJALES_API.DELETE_MINUTES_DOCUMENTS(id);
    return this.HTTP.deleteData(reqURL);
  }
  exportOccurrence(occurrenceId: string) {
    return this.HTTP.getData<Meeting & { draftId: string; draftUrl: string }>(
      MAIN_MJALES_API.EXPORT_OCCURRENCE(occurrenceId)
    );
  }
}
