import PublicGames from "@/components/PublicGames";

export default function Home() {
  return (
    <div className="bg-base-200 flex w-full flex-wrap items-center justify-evenly gap-4 rounded-xl px-4 py-10 shadow-md lg:gap-0">
      <PublicGames />

      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center">
          <h2 className="mb-4 text-xl font-bold leading-tight">Join from invite</h2>
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Invite link or code"
                className="input input-bordered"
              />
              <button className="btn btn-square">Join</button>
            </div>
          </div>
        </div>

        <div className="divider divider-vertical">or</div>

        <div className="flex flex-col items-center">
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
    </div>
  );
}
