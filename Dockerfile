FROM mcr.microsoft.com/dotnet/sdk:6.0.418 AS build
WORKDIR /app
COPY ./ ./

RUN dotnet restore
RUN dotnet publish Optiva.csproj -c Release -o out/Optiva


FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime

WORKDIR /app
COPY --from=build /app/out ./

ENTRYPOINT ["dotnet", "Optiva.dll", "--url='http://localhost:80'" ]

EXPOSE 80

