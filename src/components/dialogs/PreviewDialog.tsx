import { EmployeeFormValues } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type PreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewData: EmployeeFormValues | null;
  onClose: () => void;
};

const PreviewDialog = ({ open, onOpenChange, previewData, onClose }: PreviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-none bg-slate-50 p-0 overflow-hidden">
        <div className="h-20 bg-primary" />
        <div className="px-4 pb-4">
          <div className="relative -mt-12 mb-4 flex flex-col items-center">
            <div className="h-16 w-16 rounded-full border-4 border-white bg-white flex items-center justify-center text-slate-500 shadow-sm overflow-hidden mb-2">
              <span className="text-xl font-bold uppercase">{previewData?.fullName?.substring(0, 2)}</span>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-1">{previewData?.fullName}</h3>
              <p className="text-sm font-medium text-primary">{previewData?.designation}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white border rounded-lg flex items-center gap-2 p-2">
              <div className="h-10 w-10 bg-slate-100 rounded-md flex items-center justify-center">
                <User className="size-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Employee ID</p>
                <p className="text-sm font-semibold">{previewData?.employeeId}</p>
              </div>
            </div>

            <div className="bg-white border rounded-lg flex items-center gap-2 p-2">
              <div className="h-10 w-10 bg-slate-100 rounded-md flex items-center justify-center">
                <Mail className="size-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Email Address</p>
                <p className="text-sm font-semibold">{previewData?.emailAddress}</p>
              </div>
            </div>

            <div className="bg-white border rounded-lg flex items-center gap-2 p-2">
              <div className="h-10 w-10 bg-slate-100 rounded-md flex items-center justify-center">
                <Phone className="size-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Phone Number</p>
                <p className="text-sm font-semibold">{previewData?.phoneNumber}</p>
              </div>
            </div>
          </div>
          <Button className="w-full mt-4 cursor-pointer" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDialog;
