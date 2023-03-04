import { gql } from "@apollo/client";

export const VERIFY_ESSENCE_METADATA = gql`
  query verifyEssenceMetadata(
    $version: String!
    $name: String!
    $app_id: String!
    $metadata_id: String!
    $lang: String
  ) {
    verifyEssenceMetadata(
      input: {
        version: $version
        name: $name
        app_id: $app_id
        lang: $lang
        metadata_id: $metadata_id
      }
    ) {
      verified
    }
  }
`;
