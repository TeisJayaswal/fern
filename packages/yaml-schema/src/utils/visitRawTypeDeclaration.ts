import { assertNever } from "@fern-api/commons";
import { AliasSchema, EnumSchema, ObjectSchema, TypeDeclarationSchema, UnionSchema } from "../schemas";

export interface RawTypeDeclarationVisitor<R> {
    alias: (schema: string | AliasSchema) => R;
    object: (schema: ObjectSchema) => R;
    union: (schema: UnionSchema) => R;
    enum: (schema: EnumSchema) => R;
}

export function visitRawTypeDeclaration<R>(
    declaration: TypeDeclarationSchema,
    visitor: RawTypeDeclarationVisitor<R>
): R {
    if (isRawAliasDefinition(declaration)) {
        return visitor.alias(declaration);
    }
    if (isRawObjectDefinition(declaration)) {
        return visitor.object(declaration);
    }
    if (isRawUnionDefinition(declaration)) {
        return visitor.union(declaration);
    }
    if (isRawEnumDefinition(declaration)) {
        return visitor.enum(declaration);
    }
    assertNever(declaration);
}

function isRawAliasDefinition(rawTypeDeclaration: TypeDeclarationSchema): rawTypeDeclaration is string | AliasSchema {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return typeof rawTypeDeclaration === "string" || (rawTypeDeclaration as AliasSchema).alias != null;
}

function isRawObjectDefinition(rawTypeDeclaration: TypeDeclarationSchema): rawTypeDeclaration is ObjectSchema {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return (rawTypeDeclaration as ObjectSchema).properties != null;
}

function isRawUnionDefinition(rawTypeDeclaration: TypeDeclarationSchema): rawTypeDeclaration is UnionSchema {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return (rawTypeDeclaration as UnionSchema).union != null;
}

function isRawEnumDefinition(rawTypeDeclaration: TypeDeclarationSchema): rawTypeDeclaration is EnumSchema {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return (rawTypeDeclaration as EnumSchema).enum != null;
}