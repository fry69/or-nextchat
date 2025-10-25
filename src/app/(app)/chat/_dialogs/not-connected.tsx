"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  OAUTH_CALLBACK_URL,
  OPENROUTER_CODE_VERIFIER_KEY,
  OPENROUTER_STATE_LOCALSTORAGE_KEY,
} from "@/lib/config";
import {
  createAuthorizationUrl,
  createSHA256CodeChallenge,
  generateOAuthState,
} from "@/lib/oauth";
import { ExternalLink } from "lucide-react";

interface NotConnectedDialogProps {
  open: boolean;
}

export function NotConnectedDialog({ open }: NotConnectedDialogProps) {
  const handleGotoOAuth = async () => {
    const { codeChallenge, codeVerifier } =
      await createSHA256CodeChallenge();
    const state = generateOAuthState();

    const url = await createAuthorizationUrl({
      codeChallenge,
      callbackUrl: OAUTH_CALLBACK_URL,
      codeChallengeMethod: "S256",
      state,
    });

    localStorage.setItem(OPENROUTER_CODE_VERIFIER_KEY, codeVerifier);
    localStorage.setItem(OPENROUTER_STATE_LOCALSTORAGE_KEY, state);
    window.location.href = url;
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Connect to OpenRouter</DialogTitle>
          <DialogDescription>
            You need to connect your OpenRouter account to use this chat
            application. Click the button below to authenticate and start
            chatting.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-4">
          <p className="text-sm text-muted-foreground">
            OpenRouter provides access to multiple AI models including GPT-4,
            Claude, and more. Authentication is required to make API calls.
          </p>

          <Button onClick={handleGotoOAuth} className="w-full">
            <ExternalLink className="mr-2 h-4 w-4" />
            Connect to OpenRouter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
