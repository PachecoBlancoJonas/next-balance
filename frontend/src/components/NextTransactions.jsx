import AccountCard from "./AccountCard";

function NextTransactions() {
    return (
        <main className="mx-auto w-full max-w-screen-xl flex-1 px-6 py-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    All transactions from your connected accounts
                </p>
            </div>
            <AccountCard />
        </main>
    );
}

export default NextTransactions;
