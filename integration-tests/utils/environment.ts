import * as dotenv from 'dotenv';

dotenv.config({path: '.env'});

export const {
  ITP_API_URL, 
  ITP_ISSUER_URL, 
  ITP_MAILINATOR_API_KEY, 
  ITP_NATIVE_TEST_CLIENT_ID,
  ITP_SERVICE_CLIENT_ID, 
  ITP_TEST_USER_EMAIL, 
  ITP_TEST_USER_EXTERNAL,
  ITP_TEST_USER_PASSWORD,
  ITP_TEST_USER_SAMEORG,
} = process.env;