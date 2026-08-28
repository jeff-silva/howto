export class TestSearchDTO {
  search?: string;
  page: number = 1;
  size: number = 10;
  order: string = "id:desc";
  with?: string;
  only?: string;
  except?: string;
}

export class TestSearchUseCase {
  public async execute(data: TestSearchDTO): Promise<any> {
    data = Object.assign(new TestSearchDTO(), data);
    return {
      message: "Test criado.",
      entity: { id: crypto.randomUUID(), ...data },
    };
  }
}
