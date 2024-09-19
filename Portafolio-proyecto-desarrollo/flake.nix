{
  description = "Ambiente de trabajo en Linux";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/a3ed7406349a9335cb4c2a71369b697cecd9d351";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.x86_64-linux.default =
      pkgs.mkShell
      {
        nativeBuildInputs = with pkgs; [
          nodejs
          go-task
        ];
      };
  };
}
