#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, Map, Symbol, Vec,
};

#[contracttype]
pub enum DataKey {
    Votes,
    Options,
    HasVoted(Address),
}

#[contract]
pub struct VotingContract;

#[contractimpl]
impl VotingContract {
    /// Inicializar con las opciones de votación. Llamar una sola vez al deployar.
    pub fn init(env: Env, options: Vec<Symbol>) {
        let votes: Map<Symbol, u32> = Map::new(&env);
        env.storage().persistent().set(&DataKey::Votes, &votes);
        env.storage().persistent().set(&DataKey::Options, &options);
    }

    /// Registrar un voto. Retorna false si la wallet ya votó, true si el voto fue exitoso.
    pub fn vote(env: Env, voter: Address, option: Symbol) -> bool {
        voter.require_auth();

        let has_voted: bool = env
            .storage()
            .persistent()
            .get(&DataKey::HasVoted(voter.clone()))
            .unwrap_or(false);

        if has_voted {
            return false;
        }

        let mut votes: Map<Symbol, u32> = env
            .storage()
            .persistent()
            .get(&DataKey::Votes)
            .unwrap_or(Map::new(&env));

        let current = votes.get(option.clone()).unwrap_or(0);
        votes.set(option, current + 1);

        env.storage().persistent().set(&DataKey::Votes, &votes);
        env.storage()
            .persistent()
            .set(&DataKey::HasVoted(voter), &true);

        true
    }

    /// Retorna el mapa completo de votos: { opcion -> cantidad }
    pub fn get_votes(env: Env) -> Map<Symbol, u32> {
        env.storage()
            .persistent()
            .get(&DataKey::Votes)
            .unwrap_or(Map::new(&env))
    }

    /// Verificar si una wallet ya votó
    pub fn has_voted(env: Env, voter: Address) -> bool {
        env.storage()
            .persistent()
            .get(&DataKey::HasVoted(voter))
            .unwrap_or(false)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{symbol_short, testutils::Address as _, vec, Address, Env};

    fn setup() -> (Env, VotingContractClient<'static>) {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, VotingContract);
        let client = VotingContractClient::new(&env, &contract_id);
        client.init(&vec![
            &env,
            symbol_short!("Opcion_A"),
            symbol_short!("Opcion_B"),
            symbol_short!("Opcion_C"),
        ]);
        (env, client)
    }

    #[test]
    fn test_vote_success() {
        let (env, client) = setup();
        let voter = Address::generate(&env);

        let result = client.vote(&voter, &symbol_short!("Opcion_A"));
        assert!(result);

        let votes = client.get_votes();
        assert_eq!(votes.get(symbol_short!("Opcion_A")).unwrap(), 1);
        assert!(client.has_voted(&voter));
    }

    #[test]
    fn test_double_vote_returns_false() {
        let (env, client) = setup();
        let voter = Address::generate(&env);

        assert!(client.vote(&voter, &symbol_short!("Opcion_A")));
        assert!(!client.vote(&voter, &symbol_short!("Opcion_B"))); // segundo voto → false
    }

    #[test]
    fn test_multiple_voters() {
        let (env, client) = setup();
        let v1 = Address::generate(&env);
        let v2 = Address::generate(&env);
        let v3 = Address::generate(&env);

        client.vote(&v1, &symbol_short!("Opcion_A"));
        client.vote(&v2, &symbol_short!("Opcion_A"));
        client.vote(&v3, &symbol_short!("Opcion_B"));

        let votes = client.get_votes();
        assert_eq!(votes.get(symbol_short!("Opcion_A")).unwrap(), 2);
        assert_eq!(votes.get(symbol_short!("Opcion_B")).unwrap(), 1);
    }

    #[test]
    fn test_empty_votes_on_init() {
        let (_, client) = setup();
        let votes = client.get_votes();
        // El mapa existe pero todas las opciones tienen 0 votos
        assert_eq!(votes.get(symbol_short!("Opcion_A")).unwrap_or(0), 0);
    }
}
