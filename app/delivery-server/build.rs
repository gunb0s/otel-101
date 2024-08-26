fn main() {
    tonic_build::compile_protos("pb/otel-101.proto")
        .unwrap_or_else(|e| panic!("Failed to compile protos {:?}", e));
}
