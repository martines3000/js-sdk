import {
  W3CCredential,
  MerklizedRootPosition,
  Schema,
  SubjectPosition,
  VerifiableConstants
} from '../schema-processor';
import { DID, Id } from '@iden3/js-iden3-core';
import * as uuid from 'uuid';

export interface ClaimRequest {
  credentialSchema: string;
  type: string;
  credentialSubject: { [key: string]: any };
  expiration?: number;
  version: number;
  revNonce: number;
  subjectPosition?: SubjectPosition;
  merklizedRootPosition?: MerklizedRootPosition;
}

export const createCredential = (
  hostUrl: string,
  issuer: DID,
  request: ClaimRequest,
  schema: Schema
): W3CCredential => {
  const context = [
    VerifiableConstants.JSONLD_SCHEMA.W3C_CREDENTIAL_2018,
    VerifiableConstants.JSONLD_SCHEMA.IDEN3_CREDENTIAL,
    schema.$metadata.uris['jsonLdContext']
  ];
  const credentialType = [VerifiableConstants.CREDENTIAL_TYPE.W3C_VERIFIABLE, request.type];

  const expirationDate = request.expiration;
  const issuanceDate = Date.now() / 1000;
  const issuerDID =  issuer.toString()
  const credentialSubject = request.credentialSubject;
  credentialSubject['type'] = request.type;

  const cr = new W3CCredential();
  cr.id = `${hostUrl}/${uuid.v4()}`;
  cr['@context'] = context;
  cr.type = credentialType;
  cr.expirationDate = expirationDate;
  cr.issuanceDate = issuanceDate;
  cr.credentialSubject = credentialSubject;
  cr.issuer = issuerDID.toString();
  cr.credentialSchema = {
    id: request.credentialSchema,
    type: VerifiableConstants.JSON_SCHEMA_VALIDATOR
  };


  return cr;
};
