import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { AdminService } from '../services/admin.service'
import { Notification } from '../entity/notification.entity'
import { MatchIDType, OneClassStatus, MultiClassStatus } from '../helpers/types.helper'
import { 
  FetchValidation, changeDate, BackButton
} from '../helpers/utils.component'

