import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TickifyTicketModule", (m) => {

    const owner = m.getAccount(0);

    const ticket = m.contract("TickifyTicket", [owner]);

    return { ticket };

});