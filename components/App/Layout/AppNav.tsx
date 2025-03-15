import { Button } from "@/components/ui/button";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { TbMessageCircle } from "react-icons/tb";
export default function AppNav({ models }) {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <MdOutlineSpaceDashboard />
          </li>
          <li>
            <TbMessageCircle />
          </li>
          <li></li>
          <li>
            <div className="flex items-center justify-center gap-4">
              <Button variant={"destructive"}>Compartir</Button>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}
