import { Injectable, inject } from '@angular/core';

import { environment } from '../../../environments/environment';

import { HttpService } from '../../core/services/http.service';

import { externalRoutes } from './external.routes';
import { EXTERNAL_API } from './external.api';
import { HttpHeaders } from '@angular/common/http';

type Attendance = {
  userSecret: string;
  isAttending: boolean;
};

type Vote = {
  userSecret: string;
  choices: Choice[];
};

type Choice = {
  topicId: string;
  choiceId: string;
  otherChoice?: string;
};

@Injectable({
  providedIn: 'root',
})
export class ExternalService {
  HTTP = inject(HttpService);

  // #region Methods
  getPolls(secret: string) {
    const userSecret = encodeURIComponent(secret);
    return this.HTTP.getData<any>(EXTERNAL_API.GET_POLLS(userSecret));
  }

  getPollsByOtp(secret: string) {
    const userSecret = encodeURIComponent(secret);
    return this.HTTP.getData<any>(EXTERNAL_API.GET_POLLS_BY_OTP(userSecret));
  }

  sendVote(data: Vote) {
    return this.HTTP.sendData<any>(EXTERNAL_API.SEND_VOTE, data);
  }

  sendVoteByOTP(data: Vote) {
    return this.HTTP.sendData<any>(EXTERNAL_API.SEND_VOTE_OTP, data);
  }

  sendAttendance(secret: string, isAttending: boolean) {
    const userSecret = encodeURIComponent(secret);

    const data: Attendance = {
      userSecret,
      isAttending,
    };
    return this.HTTP.sendData<any>(EXTERNAL_API.SEND_ATTENDANCE, data);
  }

  getPreviousMeetingMinutes(secret: string) {
    const userSecret = encodeURIComponent(secret);

    return this.HTTP.getData<any>(
      EXTERNAL_API.GET_PREVIOUS_MEETING_MINUTES(userSecret)
    );
  }

  getMyMeetings(
    secret: string,
    pageIndex = 0,
    MaxResultCount = 10,
    Sorting = 'Date DESC',
    Title = '',
    Status = '',
    Date = ''
  ) {
    const userSecret = encodeURIComponent(secret);

    return this.HTTP.getData<any>(EXTERNAL_API.GET_MY_MEETINGS(userSecret), {
      SkipCount: pageIndex * MaxResultCount,
      MaxResultCount,
      Sorting,
      Title,
      Date,
      Status,
    });
  }

  voteURL(info: { id: string; title: string; tenant: string }) {
    // return `http://localhost:4200/${
    //   externalRoutes.MEETING_VOTE_USER_CHECK
    // }?id=${info.id}&title=${info.title.trim().split(' ').join('-')}&tenant=${
    //   info.tenant
    // }`;

    return `${environment.baseUrl}mjalisweb/${
      externalRoutes.MEETING_VOTE_USER_CHECK
    }?id=${info.id}&title=${info.title.trim().split(' ').join('-')}&tenant=${
      info.tenant
    }`;
  }

  requestOtpNumber(id: string, phoneNumber: string, headers: HttpHeaders) {
    return this.HTTP.sendData(
      EXTERNAL_API.CHECK_MOBILE(id),
      {
        phoneNumber,
      },
      headers
    );
  }

  validateOtpNumber(
    id: string,
    phoneNumber: string,
    code: string,
    headers: HttpHeaders
  ) {
    return this.HTTP.sendData(
      EXTERNAL_API.CHECK_OTP(id),
      {
        phoneNumber,
        code,
      },
      headers
    );
  }
}
