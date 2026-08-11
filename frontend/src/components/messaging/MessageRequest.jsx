import Button from "../ui/Button";

function MessageRequest({
  username,
  displayName,
  onAccept,
  onDecline
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold">
            {displayName}
          </h3>

          <p className="text-sm text-zinc-500">
            @{username}
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={onAccept}>
            Accept
          </Button>

          <Button
            variant="secondary"
            onClick={onDecline}
          >
            Decline
          </Button>
        </div>
      </div>

      <p className="mt-4 text-sm text-zinc-500">
        This person wants to message you.
      </p>
    </div>
  );
}

export default MessageRequest;