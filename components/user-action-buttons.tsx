import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface UserActionButtonsProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    active: boolean;
  };
  onEdit: (user: any) => void;
  onDelete: (userId: number) => void;
}

export function UserActionButtons({ user, onEdit, onDelete }: UserActionButtonsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(user)}
        className="h-8 w-8"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(user.id)}
        className="h-8 w-8"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
} 