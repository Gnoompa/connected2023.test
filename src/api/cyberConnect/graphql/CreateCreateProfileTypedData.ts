import { gql } from "@apollo/client";

export const CREATE_CREATE_PROFILE_TYPED_DATA = gql`
  mutation CreateCreateProfileTypedData(
    $input: CreateCreateProfileTypedDataInput!
  ) {
    createCreateProfileTypedData(input: $input) {
      typedDataID
    }
  }
`;
