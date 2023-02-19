import { IconRefresh } from "@tabler/icons-react";

export default function Home() {
  return (
    <div className="flex w-full flex-wrap items-center justify-evenly gap-4 px-4 py-10 lg:gap-0">
      <div className="flex flex-col items-center">
        <h2 className="mb-2 text-2xl font-bold leading-tight">
          Public games{" "}
          <div className="btn btn-sm btn-ghost">
            <IconRefresh size={16} className="" />
          </div>
        </h2>
        <div className="flex max-h-80 overflow-y-auto rounded-xl p-4">
          <table className="table-compact lg:table-normal table rounded-none">
            <thead>
              <tr>
                <th>Host</th>
                <th>Opponent</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* <tr>
                <td>(empty)</td>
                <td></td>
                <td></td>
              </tr> */}
              <tr className="group">
                <td>sample user</td>
                <td>nize</td>
                <th>
                  <button className="btn btn-ghost btn-xs focus:opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                    Join
                  </button>
                </th>
              </tr>

              {/* invisible last row to set max column widths */}
              <tr aria-hidden="true" className="pointer-events-none opacity-0">
                <td>WPlaceholder_Text</td>
                <td>WPlaceholder_Text</td>
                <th>
                  <button className="btn btn-xs">Join</button>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="mb-4 text-xl font-bold leading-tight">Join from invite</h2>
        <div className="form-control">
          <div className="input-group">
            <input type="text" placeholder="Invite link or code" className="input input-bordered" />
            <button className="btn btn-square">Join</button>
          </div>
        </div>
        <div className="divider divider-vertical">or</div>

        <h2 className="mb-4 text-xl font-bold leading-tight">Create game</h2>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Unlisted/invite-only</span>
            <input type="checkbox" className="checkbox" />
          </label>
          <label className="label">
            <span className="label-text">Select your side</span>
          </label>
          <div className="input-group">
            <select className="select select-bordered">
              <option value="random">Random</option>
              <option value="white">White</option>
              <option value="black">Black</option>
            </select>
            <button className="btn">Create</button>
          </div>
        </div>
      </div>
    </div>
  );
}
