export interface ModalInput {
  display: boolean;
  onClose: () => void;
  id: number;
}

export interface ModalInputExtraId {
  display: boolean;
  onClose: () => void;
  id: number;
  specific_id: number;
}
