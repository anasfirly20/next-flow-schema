import { Button } from "@/shared/ui/Button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/shared/ui/Sidebar";
import { FilePlus2 } from "lucide-react";
import { memo } from "react";

type CreateSchemaButtonProps = {
  onCreateSchema: () => Promise<void>;
};

export const CreateSchemaButton = memo(
  ({ onCreateSchema }: CreateSchemaButtonProps) => {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Button
                type="button"
                size="sm"
                onClick={() => void onCreateSchema()}
                className="h-9 w-full rounded-xl px-3 font-medium shadow-sm"
              >
                <FilePlus2 className="mr-1 size-4" />
                Create schema
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }
);

CreateSchemaButton.displayName = "CreateSchemaButton";
