import { IconRefresh } from "@tabler/icons-react";

export default function PublicGames() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-2 text-2xl font-bold leading-tight">
        Public games{" "}
        <div className="btn btn-sm btn-ghost">
          <IconRefresh size={16} className="" />
        </div>
      </h2>

      <div className="bg-base-100 h-80 max-h-80 overflow-y-auto">
        <table className="table-compact lg:table-normal table rounded-none">
          <thead>
            <tr>
              <th className="w-48">Host</th>
              <th className="w-48">Opponent</th>
              <th className="w-24"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>(empty)</td>
              <td></td>
              <td></td>
            </tr>
            {/* <tr className="group">
              <td>nize</td>
              <td>nize</td>
              <th>
                <button className="btn btn-ghost btn-xs focus:opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                  Join
                </button>
              </th>
            </tr> */}
            {/* <tr className="group">
              <td>WPlaceholder_Text</td>
              <td>WPlaceholder_Text</td>
              <th>
                <button className="btn btn-ghost btn-xs focus:opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                  Join
                </button>
              </th>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
