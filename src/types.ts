// Providers often supply types with their API libraries.

export interface DirectoryResponse {
  paging: {
    count: number;
    offset: number;
  };
  individuals: [DirectoryUser];
}

export interface DirectoryUser {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  department: {
    name: string;
  };
  manager: { id: string } | null;
  is_active: boolean;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  emails:
    | [
        {
          type: string;
          data: string;
        },
      ]
    | null;
  phone_numbers:
    | [
        {
          type: string;
          data: string;
        },
      ]
    | null;
  department: {
    name: string;
  };
  dob: string;
}

export interface Account {
  id: string;
  legal_name: string;
}
